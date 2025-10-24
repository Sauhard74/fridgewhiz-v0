"use client";

import { useState } from "react";
import { ChefHat, Plus, X, Search, Loader2, Flame, DollarSign } from "lucide-react";
import RecipeCard from "./components/RecipeCard";

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

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
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
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          maxCalories: maxCalories || undefined,
          maxPrice: maxPrice || undefined,
        }),
      });

      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            What's in your fridge?
          </h2>

          {/* Ingredient Input */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

