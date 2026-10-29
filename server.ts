/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not defined. Running in mock simulation fallback mode.');
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// REST Api routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mock simulation helpers if API key is not present
function generateMockResponse(ngoName: string, userMessage: string): string {
  const msgLower = userMessage.toLowerCase();
  if (msgLower.includes('coat') || msgLower.includes('jacket') || msgLower.includes('cloth')) {
    return `Thank you so much! We would love to distribute these items. Our team can help schedule a pickup from Seattle or drop off at our main warehouse. Would you like to set a time?`;
  }
  if (msgLower.includes('food') || msgLower.includes('eat') || msgLower.includes('soup') || msgLower.includes('kitchen')) {
    return `That's wonderful! Food security is a key goal for us. We accept shelf-stable packages as well as organized hot dishes. Can we coordinate the logistics?`;
  }
  if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey')) {
    return `Hello! This is ${ngoName}. How can we assist you with your donation or support needs today? We are incredibly grateful for your kindness.`;
  }
  return `Thank you for reaching out to ${ngoName}! We appreciate your message and would love to collaborate. Shall we plan the pickup or delivery of your items?`;
}

// 1. Interactive Chat Proxy
app.post('/api/chat', async (req, res) => {
  try {
    const { ngoId, ngoName, messages, userPrompt } = req.body;
    
    if (!userPrompt) {
      res.status(400).json({ error: 'Missing userPrompt' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback
      const text = generateMockResponse(ngoName || 'Hope Shelter', userPrompt);
      res.json({ reply: text });
      return;
    }

    // Prepare message history for context
    const chatHistoryContext = messages
      ? messages.slice(-8).map((m: any) => `${m.sender === 'user' ? 'Donor (Sarah)' : 'NGO Representative'}: ${m.text}`).join('\n')
      : '';

    const systemInstruction = `You are an empathetic, professional community representative for "${ngoName || 'Hope Shelter'}" (NGO ID: ${ngoId || 'hope-shelter'}).
Your tone is warm, community-oriented, encouraging, transparent, and direct (authentic humanist corporate style).
Respond to the donor as the representative of this local charity organization.
Keep your response short (1 to 3 sentences maximum, matching typical instant messaging exchanges).
The donor is Sarah, based in the San Francisco or general Washington area depending on their chosen route.
Reference details from the conversation context when appropriate.
Wait, if they ask about pickup logistics, dropoffs, or specific items, be extremely helpful and encouraging!`;

    const chatPrompt = `
Conversation History:
${chatHistoryContext}

Latest message from Donor: "${userPrompt}"

Write your next short chat message response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text?.trim() || generateMockResponse(ngoName || 'Hope Shelter', userPrompt);
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error in /api/chat:', error);
    res.status(500).json({ error: error.message || 'Error processing AI Chat response' });
  }
});

// 2. Donation Listing Auto-enhancement & Category Suggester
app.post('/api/analyze-donation', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title && !description) {
      res.status(400).json({ error: 'Provide at least title or description' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return reasonable mock suggestions
      res.json({
        category: title?.toLowerCase().includes('food') ? 'Food' : 'Clothing',
        enhancedTitle: title ? `Donation: ${title}` : 'Gently Used Local Donation',
        tip: 'Items displayed in clean boxes or washing first ensures our local shelters can distribute them immediately with high dignity.',
        tags: ['community-needs', 'direct-impact'],
      });
      return;
    }

    const analyzerPrompt = `
Analyze the details of a local donation listed by a community member and return a structured JSON response.
User Details:
Title: "${title || ''}"
Description: "${description || ''}"

Suggest:
1. "category": Choose the best target category among: [Food, Clothing, Books, Electronics, Toys, Shelter Supplies, Medical, Other].
2. "enhancedTitle": Rewrite a clear, concise, polished, human-friendly title for our feed (e.g. "5 High-Quality Winter Jackets for Kids" instead of "jackets").
3. "tip": Provide a gentle, supportive, non-critical hint for successful delivery or presentation (e.g., wash instructions, organizing into boxes). Keep it very short.
4. "tags": 2 or 3 relevant search tags/labels contextually matching the listing.

Return the result strictly as a valid, parsable JSON object matching this structure:
{
  "category": "categoryName",
  "enhancedTitle": "revisedTitle",
  "tip": "donation_tip_string",
  "tags": ["tag1", "tag2"]
}
Do not wrap it in markdown block code besides json if needed, but return pure JSON preferably.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: analyzerPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      res.json(parsed);
    } else {
      throw new Error('Empty AI response');
    }
  } catch (error: any) {
    console.error('Gemini API Error in /api/analyze-donation:', error);
    res.status(500).json({ error: 'Unable to analyze item. Falling back to default.' });
  }
});

// Set up Vite / static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Heart Hands Backend] Server running on http://localhost:${PORT} under NODE_ENV=${process.env.NODE_ENV}`);
  });
}

startServer();
