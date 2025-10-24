import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = imageFile.type;

    // Use OpenAI Vision to analyze the image
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and identify all food ingredients and items you can see. 
              Focus on raw ingredients, produce, meats, dairy, pantry items, etc.
              Return ONLY a comma-separated list of ingredient names, nothing else.
              Be specific but concise (e.g., "chicken breast" not "chicken breast in package").
              Example output: chicken breast, tomatoes, garlic, onions, milk, eggs, cheddar cheese`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const ingredientsText = response.choices[0]?.message?.content || "";
    
    // Parse the comma-separated list
    const ingredients = ingredientsText
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && item.length < 50); // Filter out invalid items

    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: "No ingredients detected in the image. Please try another image." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ingredients });
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    
    if (error.message?.includes("quota")) {
      return NextResponse.json(
        { error: "AI service quota exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze image. Please try again." },
      { status: 500 }
    );
  }
}

