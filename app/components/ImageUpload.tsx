"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onIngredientsDetected: (ingredients: string[]) => void;
}

export default function ImageUpload({ onIngredientsDetected }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload and analyze
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze image");
      }

      if (data.ingredients && data.ingredients.length > 0) {
        onIngredientsDetected(data.ingredients);
        // Clear preview after successful detection
        setTimeout(() => setPreview(null), 2000);
      } else {
        setError("No ingredients detected. Try a clearer image.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${uploading ? "border-primary-300 bg-primary-50" : "border-gray-300 hover:border-primary-500 hover:bg-primary-50"}
          ${preview ? "border-primary-500 bg-primary-50" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            <p className="text-primary-700 font-medium">Analyzing your fridge...</p>
            <p className="text-sm text-gray-500">AI is detecting ingredients</p>
          </div>
        ) : preview ? (
          <div className="space-y-3">
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-primary-700 font-medium">✓ Ingredients detected!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <div className="p-4 bg-primary-100 rounded-full">
                <Camera className="w-8 h-8 text-primary-600" />
              </div>
              <div className="p-4 bg-blue-100 rounded-full">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                📸 Upload a photo of your fridge
              </p>
              <p className="text-sm text-gray-500">
                Click to browse or drag & drop an image
              </p>
              <p className="text-xs text-gray-400 mt-2">
                AI will automatically detect ingredients
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

