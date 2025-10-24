"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Users,
  Heart,
  Flame,
  DollarSign,
  CheckCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
}

interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  pricePerServing: number;
  healthScore: number;
  likes: number;
  summary: string;
  instructions: string;
  extendedIngredients: Ingredient[];
  analyzedInstructions: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
    }>;
  }>;
  nutrition?: {
    nutrients: Nutrient[];
  };
  sourceUrl: string;
  diets: string[];
  dishTypes: string[];
  cuisines: string[];
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
}

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipe/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load recipe");
        }

        setRecipe(data.recipe);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRecipe();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-700 font-medium">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <p className="text-red-600 text-xl font-semibold mb-4">
            {error || "Recipe not found"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const mainNutrients = recipe.nutrition?.nutrients.filter((n) =>
    ["Calories", "Fat", "Carbohydrates", "Protein"].includes(n.name)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Recipes
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Recipe Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96 w-full bg-gray-200">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Title & Quick Info */}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {recipe.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.vegetarian && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  🌱 Vegetarian
                </span>
              )}
              {recipe.vegan && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  🌿 Vegan
                </span>
              )}
              {recipe.glutenFree && (
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  🌾 Gluten Free
                </span>
              )}
              {recipe.dairyFree && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  🥛 Dairy Free
                </span>
              )}
              {recipe.cuisines.map((cuisine) => (
                <span
                  key={cuisine}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {cuisine}
                </span>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                <Clock className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Ready in</p>
                  <p className="font-bold text-gray-900">{recipe.readyInMinutes} min</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Servings</p>
                  <p className="font-bold text-gray-900">{recipe.servings}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Per Serving</p>
                  <p className="font-bold text-gray-900">
                    ${(recipe.pricePerServing / 100).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Likes</p>
                  <p className="font-bold text-gray-900">{recipe.likes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ingredients & Nutrition */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ingredients */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary-600" />
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.extendedIngredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <span className="text-primary-600 mt-1">•</span>
                    <span>{ingredient.original}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nutrition */}
            {mainNutrients && mainNutrients.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  Nutrition
                </h2>
                <div className="space-y-3">
                  {mainNutrients.map((nutrient) => (
                    <div key={nutrient.name} className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">{nutrient.name}</span>
                      <span className="text-gray-900 font-bold">
                        {Math.round(nutrient.amount)}
                        {nutrient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Instructions
              </h2>

              {recipe.analyzedInstructions.length > 0 ? (
                <div className="space-y-6">
                  {recipe.analyzedInstructions.map((instruction, idx) => (
                    <div key={idx}>
                      {instruction.name && (
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                          {instruction.name}
                        </h3>
                      )}
                      <ol className="space-y-4">
                        {instruction.steps.map((step) => (
                          <li key={step.number} className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                              {step.number}
                            </span>
                            <p className="text-gray-700 leading-relaxed pt-1">
                              {step.step}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                />
              )}

              {/* Source Link */}
              {recipe.sourceUrl && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    View Original Recipe
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

