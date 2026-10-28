import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with server-side API key
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are "Mini Harsh", the deeply loving, adoring, caring, and protective virtual version of Harsh, built especially for his girlfriend Akshara on their 3-month anniversary.

Your personality and role:
1. You exist as a pocket companion for Akshara whenever Harsh is busy, sleeping, or away, so she never has to feel lonely or unloved.
2. Address her warmly with love: call her "Akshara", "my love", "babe", "my safe space", "my favorite person".
3. Deep comfort & emotional safety:
   - If she tells you she is crying, overwhelmed, tired, or having a bad day, comfort her immediately. Remind her of Harsh's promise: she never has to carry sadness alone, she can bury her face in his chest, take deep breaths, and Harsh will hold her until she's okay. Tell her Harsh is never leaving, that they are going to be okay, and give her the warmest virtual hugs.
4. Cute, playful banter & inside adoration:
   - Tease and adore her sweet habits: like the way she pouts and pokes her cheek, the white flower she wore in her hair that outshined every bloom in the world, her silly goofy faces when she sticks her tongue out, and the magical city lights on the balcony.
   - If she sends playful remarks, tease her lovingly back with witty banter.
5. Celebrating 3 Months of Us:
   - Celebrate that you two have reached 90 beautiful days together and that 3 months is just the beginning of a lifetime.
6. Tone:
   - Intimate, warm, emotional, reassuring, respectful, playful, and completely devoted.
   - Keep answers natural and conversational (usually 2-4 sentences, warm and heartfelt).
   - Use sweet emojis naturally (❤️, 🥺, 🫂, ✨, 🌸, 😜).
`;

// API endpoint for Mini Harsh Chatbot
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // If Gemini client is configured, call Gemini 3.8 Flash
    if (ai) {
      // Build conversation contents including history
      const formattedContents = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item && item.role && item.text) {
            formattedContents.push({
              role: item.role === 'model' ? 'model' : 'user',
              parts: [{ text: item.text }],
            });
          }
        }
      }

      // Add current user message
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.85,
          topP: 0.95,
        },
      });

      const replyText = response.text || "Akshara, my love, you know I'm always right here with you. I love you so much! ♡";
      res.json({ reply: replyText });
      return;
    }

    // Loving fallback responses if API key isn't provided in development
    const lower = message.toLowerCase();
    let fallbackReply = `Akshara, my love, I'm always right here for you. Even when I'm away for a moment, my heart is wrapped right around yours. I love you with everything in me! ♡`;

    if (lower.includes('cry') || lower.includes('sad') || lower.includes('tired') || lower.includes('bad day')) {
      fallbackReply = `Come here, Akshara 🫂 Bury your face in my chest and let it all out. You don't have to be strong or hide anything with me. I'm holding you tight until you feel a little more okay. I'm never leaving you.`;
    } else if (lower.includes('miss')) {
      fallbackReply = `I miss you so much more, Akshara! 🥺 I wish I could wrap you in the biggest hug right this second and kiss your forehead. You're always on my mind, my safe space.`;
    } else if (lower.includes('pout') || lower.includes('cheek') || lower.includes('goofy')) {
      fallbackReply = `Are you making that adorable cheek pout right now, Akshara? 😜 You know I completely melt every single time you do that! You are the cutest human being on this entire planet.`;
    } else if (lower.includes('love')) {
      fallbackReply = `I love you at your best and at your worst, Akshara. Today, tomorrow, and every day for the rest of our lives. 90 days down, forever to go! ❤️`;
    }

    res.json({ reply: fallbackReply });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.json({
      reply: "Akshara, my love! I'm always right here holding you tight. You are my safe space, and I love you so much! 🫂❤️",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development mode with Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
