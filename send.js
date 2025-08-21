// send.js
import express from "express";
import twilio from "twilio";

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM,        // your Twilio phone number e.g. +15551234567
  GAME_URL            // e.g. https://your-host.com/?names=Kyle,Sarah,Mo,Jay
} = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const app = express();
app.use(express.json());

app.post("/send", async (req, res) => {
  try {
    const { numbers = [], host = GAME_URL } = req.body; // numbers: ["+1555...", ...]
    const tasks = numbers.map(num =>
      client.messages.create({
        from: TWILIO_FROM,
        to: num,
        body: `Kyle: Party Roulette link → ${host}\nReply STOP to opt out.`
      })
    );
    await Promise.all(tasks);
    res.json({ ok: true, sent: numbers.length });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

app.listen(3000, () => console.log("SMS server on :3000"));
