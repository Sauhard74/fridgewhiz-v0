"use client";

import { useState } from "react";
import { ChefHat, Plus, X, Search, Loader2, Flame, DollarSign, Sparkles } from "lucide-react";
import RecipeCard from "./components/RecipeCard";
import ImageUpload from "./components/ImageUpload";

interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredients: Array<{ name: string }>;
  missedIngredients: Array<{ name: string }>;
  likes: number;
  funName?: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [maxCalories, setMaxCalories] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [diet, setDiet] = useState<string>("none");
  const [intolerances, setIntolerances] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const handleIngredientsDetected = (detectedIngredients: string[]) => {
    // Add detected ingredients that aren't already in the list
    const newIngredients = detectedIngredients.filter(
      (ing) => !ingredients.includes(ing)
    );
    if (newIngredients.length > 0) {
      setIngredients([...ingredients, ...newIngredients]);
    }
  };

  const handleIntoleranceToggle = (intolerance: string) => {
    if (intolerances.includes(intolerance)) {
      setIntolerances(intolerances.filter((i) => i !== intolerance));
    } else {
      setIntolerances([...intolerances, intolerance]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addIngredient();
    }
  };

  const findRecipes = async () => {
    if (ingredients.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          maxCalories: maxCalories || undefined,
          maxPrice: maxPrice || undefined,
          diet: diet !== "none" ? diet : undefined,
          intolerances: intolerances.length > 0 ? intolerances : undefined,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recipes");
      }

      setRecipes(data.recipes || []);
    } catch (error: any) {
      console.error("Error fetching recipes:", error);
      setError(error.message || "Failed to fetch recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-12 h-12 text-primary-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              FridgeWhiz
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Turn your leftover ingredients into delicious meals! 🍳
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            What's in your fridge?
          </h2>

          {/* Image Upload Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-700">
                AI-Powered Detection
              </h3>
            </div>
            <ImageUpload onIngredientsDetected={handleIngredientsDetected} />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Or add manually
              </span>
            </div>
          </div>

          {/* Manual Ingredient Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., chicken, tomatoes, garlic..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            />
            <button
              onClick={addIngredient}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>

          {/* Ingredients List */}
          {ingredients.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full flex items-center gap-2 font-medium"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="hover:bg-primary-200 rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="space-y-4 mb-6">
            {/* Diet Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                🥗 Diet Preference
              </label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              >
                <option value="none">No Preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="ketogenic">Ketogenic</option>
                <option value="paleo">Paleo</option>
                <option value="gluten free">Gluten Free</option>
                <option value="pescetarian">Pescetarian</option>
              </select>
            </div>

            {/* Allergies & Intolerances */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                ⚠️ Allergies & Intolerances
              </label>
              <div className="flex flex-wrap gap-2">
                {["dairy", "egg", "gluten", "peanut", "sesame", "seafood", "shellfish", "soy", "tree nut", "wheat"].map((intolerance) => (
                  <button
                    key={intolerance}
                    onClick={() => handleIntoleranceToggle(intolerance)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      intolerances.includes(intolerance)
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {intolerance.charAt(0).toUpperCase() + intolerance.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Nutrition Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Max Calories (per serving)
                </label>
                <input
                  type="number"
                  value={maxCalories}
                  onChange={(e) => setMaxCalories(e.target.value ? parseInt(e.target.value) : "")}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Max Price (per serving, $)
                </label>
                <input
                  type="number"
                  step="0.50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : "")}
                  placeholder="e.g., 5.00"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={findRecipes}
            disabled={ingredients.length === 0 || loading}
            className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Finding Recipes...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Find Recipes
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  !
                </div>
                <div className="flex-1">
                  <h3 className="text-red-800 font-bold mb-1">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                  {error.includes("quota") && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-red-600 text-xs font-medium mb-2">Solutions:</p>
                      <ul className="text-red-600 text-xs space-y-1 list-disc list-inside">
                        <li>Wait 24 hours for your API quota to reset</li>
                        <li>Check your usage at: <a href="https://spoonacular.com/food-api/console#Dashboard" target="_blank" rel="noopener noreferrer" className="underline">Spoonacular Dashboard</a></li>
                        <li>Consider upgrading to a paid plan for more requests</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {recipes.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Found {recipes.length} Recipe{recipes.length !== 1 ? "s" : ""}! 🎉
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}

        {recipes.length === 0 && !loading && ingredients.length > 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <p className="text-gray-500 text-lg">
              Click "Find Recipes" to see what you can make!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

