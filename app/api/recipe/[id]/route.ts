import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = params.id;

    if (!SPOONACULAR_API_KEY) {
      return NextResponse.json(
        { error: "Spoonacular API key not configured" },
        { status: 500 }
      );
    }

    // Fetch detailed recipe information
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/information`,
      {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          includeNutrition: true,
        },
      }
    );

    return NextResponse.json({ recipe: response.data });
  } catch (error: any) {
    console.error("Error fetching recipe details:", error);

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch recipe details" },
      { status: 500 }
    );
  }
}

