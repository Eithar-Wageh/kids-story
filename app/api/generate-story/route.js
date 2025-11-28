import { db } from "@/config/db"
import { storyTable } from "@/config/schema"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import uuid4 from "uuid4"
import { GoogleGenerativeAI } from "@google/generative-ai"
import axios from "axios"
export async function POST(req) {
    const {storyId,storySubject,storyTypes,ageGroup}=await req.json()
    const user = await currentUser()
    if (!user) {
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }


const PROMPT=`Create a magical and engaging children's story based
on the following input:
- Title/Subject:${storySubject}
- Story Types:${storyTypes}
-Age Group:${ageGroup}


Your response should be returned strictly in 
JSON format and follow the schema described.

Story Details :
- Title/Subject:${storySubject}
- Story Types:${storyTypes}
-Age Group:${ageGroup}

-Make the language appropriate for ${ageGroup} children

-Include moral lessons and positive values

-Create engaging characters and plot

- Make it ${storyTypes === 'Educational'? 'educational and informative': storyTypes === 'Bed Story'? 'calming and soothing for bedtime':

'adventurous and exciting'}

-Generate 5-8 chapters/pages depending on the age group

Create an appropriate image prompt for the story cover:

"Create a whimsical and colorful children's book illustration for a story about '${storySubject}'. The artwork should be in a friendly, cartoon-like style suitable for ${ageGroup} children. Include bright, cheerful colors with characters that look approachable and magical. The scene should capture the essence of '${storySubject}' with elements that would appeal to young readers. Make it look like a professional children's book cover with a dreamy, imaginative quality perfect for a ${storyTypes.toLowerCase()}."


Important:

-The story content should be specifically about: ${storySubject}

-Make it appropriate for ${ageGroup} age group
-Style it as a ${storyTypes}

-Include positive messages and age-appropriate vocabulary

-Each chapter should be engaging but not too long for the target age

group

-CRITICAL: Return ONLY valid JSON, no additional text or explanations

-Ensure all strings are properly escaped and quoted

-Do not include trailing commas in JSON objects or arrays


Respond using this EXACT JSON structure only (no extra text):

{

"story": {

"title": "Creative story title here",

"description":"story summary here"

"type": "${storyTypes}",

"ageGroup": "${ageGroup}",

"totalPages": 6,

"imagePrompt": "Cover image description here",

"pages": [

{

"pageNumber": 1,

"title": "Chapter title here",

"content": "Story content here",

"imagePrompt": "Page image description here"

}

]

}
}
`
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is missing!");
const genAI = new GoogleGenerativeAI(apiKey);
  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    thinkingConfig: {
      thinkingLevel: 'HIGH',
    },
    tools,
  };
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }

  // أضف السطر ده عشان يشتغل مع النسخة الجديدة

});
  const contents = [
    {
        role: 'user',
        parts: [
            {
                text:PROMPT,
                responseMimeType: "application/json"  // مهم جدًا عشان يرجع JSON نظيف
            },
      ],
    },
  ];// استدعاء Gemini
const geminiResult = await model.generateContent(PROMPT);
const text = geminiResult.response.text();

// تنظيف الـ JSON
const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
const storyData = JSON.parse(cleanJson);
const imagePrompt=storyData.story?.imagePrompt
const imgeURL= await generateImage(imagePrompt)
// حفظ القصة في الداتابيز
const dbResult = await db.insert(storyTable).values({
    storyId: uuid4(),
    storySubject,
    storyTypes,
    ageGroup,
    content: storyData,
    imageURL:imgeURL,
    email: user.primaryEmailAddress?.emailAddress,
});

return NextResponse.json({ 
    success: true, 
    storyId: dbResult[0]?.storyId || uuid4() 
})}
const generateImage = async (prompt) => {
  try {
    const cleanPrompt = (prompt || storyData.story?.imagePrompt || storySubject)
      .replace(/"/g, "")
      .replace(/\n/g, " ")
      .trim();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      cleanPrompt + " cartoon style, colorful children's book cover, magical illustration, vibrant colors, whimsical, professional, highly detailed"
    )}?width=1024&height=1024&nologo=true&safe=true`;

    console.log("successfuly", imageUrl);
    return imageUrl;

  } catch (error) {
    console.error("error Pollinations:", error.message);
    return "https://via.placeholder.com/1024x1024/8b5cf6/ffffff?text=Once+Upon+A+Time";
  }
};