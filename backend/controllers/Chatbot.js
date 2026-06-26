const { groq, SYSTEM_PROMPT, TAILOR_SYSTEM_PROMPT } = require("../config/ai");
const Tailor = require("../models/Tailor");

const customerSessions = {}; // sessionId -> message history array (customer chat)
const tailorSessions = {};   // sessionId -> message history array (tailor "Ask Pro" chat)

function looksLikeTailorQuery(message) {
  return /tailor|suggest|recommend|find|bridal|formal|casual|stitch|near|city/i.test(message);
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

    if (looksLikeTailorQuery(message)) {
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