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

    const kjvBible = res.data.data.find(bible =>
      bible.name.toLowerCase().includes("king james")
    );

    return kjvBible?.id || null;
  } catch (error) {
    console.error("❌ Failed to fetch KJV Bible ID:", error.message);
    return null;
  }
};

// Step 2: Get a random verse reference (limited to shorter books/chapters)
const getRandomVerseReference = () => {
  const verses = [
    "GEN.1.1", "PSA.23.1", "ISA.41.10", "JHN.3.16", "ROM.8.28",
    "PHP.4.13", "MAT.5.14", "PRO.3.5", "HEB.11.1", "1CO.13.4",
    "2TI.1.7", "JAS.1.5", "1PE.5.7", "EPH.2.8", "LUK.1.37"
  ];

  const randomIndex = Math.floor(Math.random() * verses.length);
  return verses[randomIndex];
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
      content: content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim(),
    };
  } catch (error) {
    console.error("❌ Failed to fetch random verse:", error.message);
    return null;
  }
};

// Step 4: Send the email to all subscribers
export const sendDailyVerseToSubscribers = async () => {
  const verse = await getRandomVerse();
  if (!verse) return;

  const { reference, content } = verse;

  const emailSubject = `📖 Your Daily Verse — ${reference}`;
  const emailBody = `
Dear Beloved,

📖 Today's verse from the King James Bible:

"${content}"
— ${reference}

🙏 May God's Word bring you peace, strength, and encouragement today.

Blessings,  
Centro Biblia Team  
Sent on ${dayjs().format("MMMM D, YYYY")}
  `.trim();

  try {
    const subscribers = await Subscriber.find({});
    for (const sub of subscribers) {
      await sendEmail({
        email: sub.email,
        subject: emailSubject,
        message: emailBody,
      });
    }

    console.log("✅ Daily verse sent to all subscribers.");
  } catch (err) {
    console.error("❌ Failed to send daily verse email:", err);
  }
};
