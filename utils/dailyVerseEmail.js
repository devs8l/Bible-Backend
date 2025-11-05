import axios from "axios";
import dayjs from "dayjs";
import Subscriber from "../models/Subscriber.js";
import sendEmail from "./subscribeEmail.js";

const SCRIPTURE_API_KEY = process.env.SCRIPTURE_API_KEY;

// Step 1: Get the KJV Bible ID dynamically
const getKjvBibleId = async () => {
  try {
    const res = await axios.get("https://api.scripture.api.bible/v1/bibles", {
      headers: { "api-key": SCRIPTURE_API_KEY },
    });

    const kjvBible = res.data.data.find((bible) =>
      bible.name.toLowerCase().includes("king james")
    );

    return kjvBible?.id || null;
  } catch (error) {
    console.error("❌ Failed to fetch KJV Bible ID:", error.message);
    return null;
  }
};

// Step 2: Get a random verse reference
const getRandomVerseReference = () => {
  const verses = [
    "GEN.1.1", "PSA.23.1", "ISA.41.10", "JHN.3.16", "ROM.8.28",
    "PHP.4.13", "MAT.5.14", "PRO.3.5", "HEB.11.1", "1CO.13.4",
    "2TI.1.7", "JAS.1.5", "1PE.5.7", "EPH.2.8", "LUK.1.37"
  ];

  return verses[Math.floor(Math.random() * verses.length)];
};

// Step 3: Fetch the verse content
const getRandomVerse = async () => {
  try {
    const kjvId = await getKjvBibleId();
    if (!kjvId) return null;

    const verseId = getRandomVerseReference();
    const url = `https://api.scripture.api.bible/v1/bibles/${kjvId}/verses/${verseId}?content-type=text`;

    const res = await axios.get(url, {
      headers: { "api-key": SCRIPTURE_API_KEY },
    });

    const { reference, content } = res.data.data;

    return {
      reference,
      content: content.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim(),
    };
  } catch (error) {
    console.error("❌ Failed to fetch random verse:", error.message);
    return null;
  }
};

// Step 4: Send the beautifully styled email to all subscribers
export const sendDailyVerseToSubscribers = async () => {
  const verse = await getRandomVerse();
  if (!verse) return;

  const { reference, content } = verse;
  const date = dayjs().format("MMMM D, YYYY");

  const emailSubject = `📖 Your Daily Verse — ${reference}`;
  const emailHtml = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f8fa; padding: 40px 0;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color:#2674C3; color: white; padding: 24px 16px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">Centro Biblia</h1>
        <p style="margin: 5px 0 0; font-size: 14px;">Your Daily Verse from the King James Bible</p>
      </div>

      <!-- Verse Body -->
      <div style="padding: 30px 20px; color: #333;">
        <p style="font-size: 16px;">Dear Beloved,</p>

        <p style="font-size: 15px; color: #555; line-height: 1.7;">
          Here’s your verse for today — may it uplift your spirit and guide your heart.
        </p>

        <blockquote style="margin: 24px 0; padding: 20px; background: #f5f6ff; border-left: 6px solid #4158D0; border-radius: 8px;">
          <p style="font-size: 18px; color: #222; font-style: italic; margin: 0;">“${content}”</p>
          <p style="text-align: right; margin-top: 12px; color: #555; font-weight: bold;">— ${reference}</p>
        </blockquote>

        <p style="font-size: 15px; color: #555; line-height: 1.7;">
          🙏 May the Word of God bring peace, strength, and joy into your day.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://centrobiblia.com" 
            style="background-color: #2674C3; color: #fff; text-decoration: none; padding: 12px 26px; border-radius: 6px; font-weight: 600; display: inline-block;">
            🌿 Visit Centro Biblia
          </a>
        </div>

        <p style="font-size: 13px; color: #777; text-align: center;">
          Sent with blessings on ${date}.<br/>
          <strong>Centro Biblia Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f2f3f5; text-align: center; padding: 12px; font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} Centro Biblia — All Rights Reserved.
      </div>
    </div>
  </div>
  `;

  try {
    const subscribers = await Subscriber.find({});
    for (const sub of subscribers) {
      await sendEmail({
        email: sub.email,
        subject: emailSubject,
        message: `Today's verse: ${content} — ${reference}`,
        html: emailHtml, // ✅ use the styled HTML
      });
    }

    console.log("✅ Beautiful daily verse sent to all subscribers.");
  } catch (err) {
    console.error("❌ Failed to send daily verse email:", err);
  }
};
