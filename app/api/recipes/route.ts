import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface RecipeRequest {
  ingredients: string[];
  maxCalories?: number;
  maxPrice?: number;
  diet?: string;
  intolerances?: string[];
}

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  usedIngredients: Array<{ name: string }>;
  missedIngredients: Array<{ name: string }>;
  likes: number;
}

// Generate fun recipe names using OpenAI
async function generateFunNames(recipes: SpoonacularRecipe[]): Promise<string[]> {
  if (!OPENAI_API_KEY) {
    return recipes.map(() => "");
  }

  try {
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const recipeNames = recipes.map((r) => r.title).join(", ");
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a creative chef who creates funny, punny recipe names. Generate creative alternative names that are humorous and reflect the situation of using leftover ingredients (like 'Crisis Curry', 'End-of-Month Pasta', 'Fridge Cleanout Special', 'Whatever's Left Stir-Fry'). Keep them short (2-4 words).",
        },
        {
          role: "user",
          content: `Generate ${recipes.length} funny alternative names for these recipes: ${recipeNames}. Return ONLY the names, one per line, no numbers or extra text.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 200,
    });

    const funNames = completion.choices[0]?.message?.content
      ?.split("\n")
      .filter((name) => name.trim())
      .map((name) => name.trim());

    return funNames || recipes.map(() => "");
  } catch (error) {
    console.error("Error generating fun names:", error);
    return recipes.map(() => "");
  }
}

// Fetch recipe details including nutrition and price
async function enrichRecipeDetails(
  recipes: SpoonacularRecipe[],
  maxCalories?: number,
  maxPrice?: number
): Promise<SpoonacularRecipe[]> {
  if (!maxCalories && !maxPrice) {
    return recipes;
  }

  try {
    const enrichedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        try {
          const response = await axios.get(
            `https://api.spoonacular.com/recipes/${recipe.id}/information`,
            {
              params: {
                apiKey: SPOONACULAR_API_KEY,
                includeNutrition: !!maxCalories,
              },
            }
          );

          const data = response.data;

          // Check calorie constraint
          if (maxCalories && data.nutrition?.nutrients) {
            const calories = data.nutrition.nutrients.find(
              (n: any) => n.name === "Calories"
            );
            if (calories && calories.amount > maxCalories) {
              return null;
            }
          }

          // Check price constraint
          if (maxPrice && data.pricePerServing) {
            const pricePerServing = data.pricePerServing / 100; // Convert cents to dollars
            if (pricePerServing > maxPrice) {
              return null;
            }
          }

          return recipe;
        } catch (error) {
          console.error(`Error fetching details for recipe ${recipe.id}:`, error);
          return recipe; // Return recipe anyway if details fetch fails
        }
      })
    );

    return enrichedRecipes.filter((recipe) => recipe !== null) as SpoonacularRecipe[];
  } catch (error) {
    console.error("Error enriching recipe details:", error);
    return recipes;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RecipeRequest = await request.json();
    const { ingredients, maxCalories, maxPrice, diet, intolerances } = body;

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one ingredient" },
        { status: 400 }
      );
    }

    if (!SPOONACULAR_API_KEY) {
      return NextResponse.json(
        { error: "Spoonacular API key not configured" },
        { status: 500 }
      );
    }

    // Build query params for Spoonacular
    const queryParams: any = {
      apiKey: SPOONACULAR_API_KEY,
      ingredients: ingredients.join(","),
      number: 12,
      ranking: 2, // Maximize used ingredients
      ignorePantry: true,
    };

    // Add diet filter if specified
    if (diet && diet !== "none") {
      queryParams.diet = diet;
    }

    // Add intolerances filter if specified
    if (intolerances && intolerances.length > 0) {
      queryParams.intolerances = intolerances.join(",");
    }

    // Fetch recipes from Spoonacular
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByIngredients",
      {
        params: queryParams,
      }
    );

    let recipes: SpoonacularRecipe[] = response.data;

    // Filter by calories and price if specified
    if (maxCalories || maxPrice) {
      recipes = await enrichRecipeDetails(recipes, maxCalories, maxPrice);
    }

    // Generate fun names (optional, only if OpenAI is configured)
    const funNames = await generateFunNames(recipes);

    // Add fun names to recipes
    const recipesWithFunNames = recipes.map((recipe, index) => ({
      ...recipe,
      funName: funNames[index] || undefined,
    }));

    return NextResponse.json({ recipes: recipesWithFunNames });
  } catch (error: any) {
    console.error("Error fetching recipes:", error);
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your Spoonacular API key." },
        { status: 401 }
      );
    }

    if (error.response?.status === 402) {
      return NextResponse.json(
        { error: "Spoonacular API quota exceeded. Please try again later." },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch recipes. Please try again." },
      { status: 500 }
    );
  }
}

