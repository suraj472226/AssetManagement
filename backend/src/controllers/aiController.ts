import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import asyncHandler from 'express-async-handler';

// Initialize Gemini (Make sure GEMINI_API_KEY is in your .env file)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// @desc    Analyze maintenance issue using AI
// @route   POST /api/ai/analyze
// @access  Private
export const analyzeIssue = asyncHandler(async (req: Request, res: Response) => {
  const { description } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    res.status(500);
    throw new Error('AI Service not configured (Missing API Key)');
  }

  try {
    // Use the 2.0 Flash model for speed and cost-efficiency
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Act as an IT Expert. Analyze the following IT asset issue description: "${description}".
      
      Return ONLY a JSON object (no markdown, no extra text) with the following 3 fields:
      1. priority: "high", "medium", or "low".
      2. category: "hardware", "software", or "network".
      3. suggestion: A short, technical suggestion for the admin (max 1 sentence).
      
      Example output: {"priority": "high", "category": "hardware", "suggestion": "Check fan bearings for physical damage."}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean up the text to ensure valid JSON (remove markdown code blocks if AI adds them)
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const analysis = JSON.parse(jsonString);

    res.json(analysis);
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500);
    throw new Error('Failed to analyze issue');
  }
});