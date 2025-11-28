import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { storyTypes, ageGroup } = await req.json();

    const PROMPT = `Suggest 3 creative and original children's story ideas
- Story Type: ${storyTypes}
- Age Group: ${ageGroup}

Return ONLY valid JSON in this exact format:
{
  "suggestions": [
    {
      "title": "Suggested story title",
      "description": "Short summary of the story idea",
      "imagePrompt": "Detailed cover image prompt in English, cartoon style, colorful, magical, suitable for ${ageGroup} children"
    }
  ]
}`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing!");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(PROMPT);
    const text = result.response.text();

    // تنظيف الـ JSON
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    // توليد صور لكل اقتراح
    const suggestionsWithImages = data.suggestions.map(suggestion => {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        suggestion.imagePrompt + " cartoon style, colorful children's book cover, magical, vibrant colors, whimsical, highly detailed"
      )}?width=1024&height=1024&nologo=true&safe=true`;

      return {
        ...suggestion,
        imageURL: imageUrl
      };
    });

    return NextResponse.json({
      success: true,
      suggestions: suggestionsWithImages
    });

  } catch (error) {
    console.error("error suggesst", error.message);
    return NextResponse.json(
      { error: "success suggesst", details: error.message },
      { status: 500 }
    );
  }
}