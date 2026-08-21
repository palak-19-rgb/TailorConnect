const { groq, SYSTEM_PROMPT, TAILOR_SYSTEM_PROMPT } = require("../config/ai");
const Tailor = require("../models/Tailor");
const { retrieveRelevantKnowledge } = require("../services/ragService");
const customerSessions = {}; // sessionId -> message history array (customer chat)
const tailorSessions = {};   // sessionId -> message history array (tailor "Ask Pro" chat)
const MAX_SESSIONS = 500;
const MAX_SESSION_ID_LENGTH = 128;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 20;

function getSession(store, sessionId, systemPrompt) {
  if (typeof sessionId !== "string" || !sessionId.trim() || sessionId.length > MAX_SESSION_ID_LENGTH) {
    const error = new Error("Invalid sessionId");
    error.statusCode = 400;
    throw error;
  }

  if (!store[sessionId]) {
    if (Object.keys(store).length >= MAX_SESSIONS) {
      delete store[Object.keys(store)[0]];
    }
    store[sessionId] = [{ role: "system", content: systemPrompt }];
  }
  return store[sessionId];
}

function appendMessage(history, message) {
  history.push(message);
  // Keep the system prompt and the most recent conversation context only.
  if (history.length > MAX_HISTORY_MESSAGES + 1) {
    history.splice(1, history.length - (MAX_HISTORY_MESSAGES + 1));
  }
}

function validateChatInput(message, sessionId) {
  if (typeof message !== "string" || !message.trim() || message.length > MAX_MESSAGE_LENGTH) {
    const error = new Error("message must be between 1 and 2000 characters");
    error.statusCode = 400;
    throw error;
  }
  return message.trim();
}

function looksLikeTailorQuery(message) {
  return /tailor|tailors|find.*tailor|recommend.*tailor|suggest.*tailor|near.*tailor|tailor.*near|tailor shop/i.test(message);
}

function looksLikeOutfitImageQuery(message) {
  return /generate.*(image|photo|outfit|dress|look)|generate|image|photo|dikhao|kaisa lagega|visualize|show.*(outfit|dress|look)|outfit.*(show|image|photo)|dress.*(look|show)|look.*(dress|outfit)/i.test(message);
}


function looksLikeMeasurementQuery(message) {
  const hasHeightOrWeight = /height|weight|tall|kg|cm|feet|foot|ft|inch|lbs|pounds/i.test(message);
  const hasMeasurementIntent = /measurement|size|fit|chest|waist|hip|stitch.*me|outfit/i.test(message);
  const hasNumbers = /\d/.test(message);
  return hasNumbers && (hasHeightOrWeight || hasMeasurementIntent);
}

function looksLikeFashionKnowledgeQuery(message) {
  return /fabric|color|wear|outfit|fashion|wedding|formal|casual|dress|style|material|suit|kurta|sherwani|saree|lehenga|shirt|trouser|summer|winter|occasion|event/i.test(message);
}




async function chatWithBot(req, res) {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ msg: "message and sessionId required" });
    }

    const cleanMessage = validateChatInput(message, sessionId);
    const session = getSession(customerSessions, sessionId, SYSTEM_PROMPT);

    let userContent = cleanMessage;

    if (looksLikeOutfitImageQuery(cleanMessage)) {

      const imagePrompt = `indian traditional outfit, ${cleanMessage}, elegant, detailed, fashion photography, high quality`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}`;

      appendMessage(session, { role: "user", content: cleanMessage });

      const completion = await groq.chat.completions.create({
        messages: [
          ...session,
          { role: "system", content: "User wants to visualize an outfit. Describe it beautifully in 2-3 lines and tell them an AI-generated preview is being shown below." }
        ],
        model: "openai/gpt-oss-20b",
      });

      const reply = completion.choices[0].message.content;
      appendMessage(session, { role: "assistant", content: reply });

      return res.json({ status: true, reply, imageUrl });

    } else if (looksLikeTailorQuery(cleanMessage)) {

      const tailors = await Tailor.find({})
        .select("-pwd -aadhaarNumber -aadharCard")
        .limit(8);

      const context = tailors.map(t => ({
        name: t.shopName,
        owner: t.ownerName,
        city: t.shopAddress?.city,
        workType: t.workType,
        experience: t.experience,
        rating: t.reviews?.length
          ? (t.reviews.reduce((a, r) => a + r.rating, 0) / t.reviews.length).toFixed(1)
          : "No ratings yet"
      }));

      userContent = `User asked: "${cleanMessage}"

Here is real tailor data from our database (use ONLY this data, don't invent names):
${JSON.stringify(context)}

Recommend the best 1-3 matches by name with a short reason. If nothing matches, say so honestly.`;
    } else if (looksLikeMeasurementQuery(cleanMessage)) {

      userContent = `User asked: "${cleanMessage}"

The user wants rough measurement estimates based on the height/weight/details they provided.

Give them estimated chest, waist, and hip measurements in inches based on standard body proportions.

Clearly label these as rough estimates and remind them to get exact measurements from a tailor for the best fit.`;

    } else if (looksLikeFashionKnowledgeQuery(cleanMessage)) {

      const retrievedKnowledge =
        await retrieveRelevantKnowledge(cleanMessage);

      const knowledgeContext = retrievedKnowledge
        .map(item => `- ${item.text}`)
        .join("\n");

      userContent = `User asked: "${cleanMessage}"

Relevant fashion knowledge from TailorConnect's knowledge base:

${knowledgeContext}

Use this knowledge to answer the user's question when relevant.
Do not mention the knowledge base, embeddings, vector search, or retrieval process.
Do not invent facts that are not supported by the provided knowledge.
Keep the answer short, warm, and practical.`;
    }

    appendMessage(session, { role: "user", content: userContent });
    const completion = await groq.chat.completions.create({
      messages: session,
      model: "openai/gpt-oss-20b",
    });

    const reply = completion.choices[0].message.content;
    appendMessage(session, { role: "assistant", content: reply });

    res.json({ status: true, reply });

  } catch (err) {
    console.log("GROQ ERROR:", err);
    res.status(err.statusCode || 500).json({ status: false, msg: err.message });
  }
}
async function chatWithTailor(req, res) {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ msg: "message and sessionId required" });
    }

    const cleanMessage = validateChatInput(message, sessionId);
    const session = getSession(tailorSessions, sessionId, TAILOR_SYSTEM_PROMPT);

    if (looksLikeOutfitImageQuery(cleanMessage)) {
      const imagePrompt = `indian traditional outfit, ${cleanMessage}, elegant, detailed, fashion photography, high quality`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}`;

      appendMessage(session, { role: "user", content: cleanMessage });

      const completion = await groq.chat.completions.create({
        messages: [
          ...session,
          { role: "system", content: "User wants to visualize an outfit for reference. Describe it beautifully in 2-3 lines and tell them an AI-generated preview is being shown below." }
        ],
        model: "openai/gpt-oss-20b",

      });

      const reply = completion.choices[0].message.content;
      appendMessage(session, { role: "assistant", content: reply });

      return res.json({ status: true, reply, imageUrl });
    }

    appendMessage(session, { role: "user", content: cleanMessage });

    const completion = await groq.chat.completions.create({
      messages: session,
     model: "openai/gpt-oss-20b",
    });

    const reply = completion.choices[0].message.content;
    appendMessage(session, { role: "assistant", content: reply });

    res.json({ status: true, reply });

  } catch (err) {
    console.log("GROQ ERROR:", err);
    res.status(err.statusCode || 500).json({ status: false, msg: err.message });
  }
}


module.exports = { chatWithBot, chatWithTailor };
