const { groq, SYSTEM_PROMPT, TAILOR_SYSTEM_PROMPT } = require("../config/ai");
const Tailor = require("../models/Tailor");

const customerSessions = {}; // sessionId -> message history array (customer chat)
const tailorSessions = {};   // sessionId -> message history array (tailor "Ask Pro" chat)

function looksLikeTailorQuery(message) {
  return /tailor|suggest|recommend|find|bridal|formal|casual|stitch|near|city/i.test(message);
}


function looksLikeOutfitImageQuery(message) {
  return /generate|image|photo|dikhao|kaisa lagega|design|visualize|show.*outfit|outfit.*show|dress.*look|look.*dress|lehenga|sherwani|saree|kurta|suit/i.test(message);
}


function looksLikeMeasurementQuery(message) {
  const hasHeightOrWeight = /height|weight|tall|kg|cm|feet|foot|ft|inch|lbs|pounds/i.test(message);
  const hasMeasurementIntent = /measurement|size|fit|chest|waist|hip|stitch.*me|outfit/i.test(message);
  const hasNumbers = /\d/.test(message);
  return hasNumbers && (hasHeightOrWeight || hasMeasurementIntent);
}






async function chatWithBot(req, res) {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ msg: "message and sessionId required" });
    }

    if (!customerSessions[sessionId]) {
      customerSessions[sessionId] = [{ role: "system", content: SYSTEM_PROMPT }];
    }

    let userContent = message;

    if (looksLikeOutfitImageQuery(message)) {

      const imagePrompt = `indian traditional outfit, ${message}, elegant, detailed, fashion photography, high quality`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}`;

      customerSessions[sessionId].push({ role: "user", content: message });

      const completion = await groq.chat.completions.create({
        messages: [
          ...customerSessions[sessionId],
          { role: "system", content: "User wants to visualize an outfit. Describe it beautifully in 2-3 lines and tell them an AI-generated preview is being shown below." }
        ],
        model: "llama-3.3-70b-versatile",
      });

      const reply = completion.choices[0].message.content;
      customerSessions[sessionId].push({ role: "assistant", content: reply });

      return res.json({ status: true, reply, imageUrl });

    } else if (looksLikeTailorQuery(message)) {

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

      userContent = `User asked: "${message}"

Here is real tailor data from our database (use ONLY this data, don't invent names):
${JSON.stringify(context)}

Recommend the best 1-3 matches by name with a short reason. If nothing matches, say so honestly.`;

    } else if (looksLikeMeasurementQuery(message)) {

      userContent = `User asked: "${message}"

The user wants rough measurement estimates based on the height/weight/details they provided. 
Give them estimated chest, waist, and hip measurements in inches based on standard body proportions. 
Clearly label these as rough estimates and remind them to get exact measurements from a tailor for the best fit.`;
    }

    customerSessions[sessionId].push({ role: "user", content: userContent });

    const completion = await groq.chat.completions.create({
      messages: customerSessions[sessionId],
      model: "llama-3.3-70b-versatile",
    });

    const reply = completion.choices[0].message.content;
    customerSessions[sessionId].push({ role: "assistant", content: reply });

    res.json({ status: true, reply });

  } catch (err) {
    console.log("GROQ ERROR:", err);
    res.status(500).json({ status: false, msg: err.message });
  }
}
async function chatWithTailor(req, res) {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ msg: "message and sessionId required" });
    }

    if (!tailorSessions[sessionId]) {
      tailorSessions[sessionId] = [{ role: "system", content: TAILOR_SYSTEM_PROMPT }];
    }

    if (looksLikeOutfitImageQuery(message)) {
      const imagePrompt = `indian traditional outfit, ${message}, elegant, detailed, fashion photography, high quality`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}`;

      tailorSessions[sessionId].push({ role: "user", content: message });

      const completion = await groq.chat.completions.create({
        messages: [
          ...tailorSessions[sessionId],
          { role: "system", content: "User wants to visualize an outfit for reference. Describe it beautifully in 2-3 lines and tell them an AI-generated preview is being shown below." }
        ],
        model: "llama-3.3-70b-versatile",
      });

      const reply = completion.choices[0].message.content;
      tailorSessions[sessionId].push({ role: "assistant", content: reply });

      return res.json({ status: true, reply, imageUrl });
    }

    tailorSessions[sessionId].push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
      messages: tailorSessions[sessionId],
      model: "llama-3.3-70b-versatile",
    });

    const reply = completion.choices[0].message.content;
    tailorSessions[sessionId].push({ role: "assistant", content: reply });

    res.json({ status: true, reply });

  } catch (err) {
    console.log("GROQ ERROR:", err);
    res.status(500).json({ status: false, msg: err.message });
  }
}


module.exports = { chatWithBot, chatWithTailor };