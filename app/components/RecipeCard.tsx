import { Heart, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredients: Array<{ name: string }>;
  missedIngredients: Array<{ name: string }>;
  likes: number;
  funName?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Fun Name */}
        {recipe.funName && (
          <div className="mb-2">
            <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {recipe.funName}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Ingredients */}
        <div className="mb-4 flex-1">
          {recipe.usedIngredients.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-1 text-sm text-green-600 font-medium mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>You have:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {recipe.usedIngredients.slice(0, 3).map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                  >
                    {ing.name}
                  </span>
                ))}
                {recipe.usedIngredients.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{recipe.usedIngredients.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {recipe.missedIngredients.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-sm text-orange-600 font-medium mb-1">
                <AlertCircle className="w-4 h-4" />
                <span>You need:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {recipe.missedIngredients.slice(0, 3).map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
                  >
                    {ing.name}
                  </span>
                ))}
                {recipe.missedIngredients.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{recipe.missedIngredients.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-600">
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            <span className="text-sm font-medium">{recipe.likes}</span>
          </div>
          <Link
            href={`/recipe/${recipe.id}`}
            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
          >
            View Recipe
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

