'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

interface CharacterCreatorProps {
  onCharacterCreated: (imageUrl: string) => void;
}

export default function CharacterCreator({ onCharacterCreated }: CharacterCreatorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setError(null);
      setGeneratedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateCharacter = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', fileInputRef.current.files[0]);

      const response = await fetch('/api/character', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create character');
      }

      setGeneratedImage(data.imageUrl);
      onCharacterCreated(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create Your Character
      </h2>
      <p className="text-gray-600 mb-6">
        Upload a photo and watch it transform into a fun cartoon character!
      </p>

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} onClose={() => setError(null)} />
        </div>
      )}

      <div className="space-y-4">
        {/* Upload Section */}
        {!selectedImage && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-lg font-medium text-gray-700">
                Click to upload a photo
              </span>
              <span className="text-sm text-gray-500 mt-2">
                PNG, JPG up to 10MB
              </span>
            </label>
          </div>
        )}

        {/* Preview and Generate Section */}
        {selectedImage && !isLoading && !generatedImage && (
          <div className="space-y-4">
            <div className="relative w-full aspect-square max-w-md mx-auto rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt="Selected photo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Choose Different Photo
              </button>
              <button
                onClick={handleCreateCharacter}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
              >
                Create Character
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner text="Creating your cartoon character... This may take a minute!" />
        )}

        {/* Result Section */}
        {generatedImage && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Original</h3>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={selectedImage!}
                    alt="Original photo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Cartoon Character</h3>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={generatedImage}
                    alt="Generated character"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
              >
                Create Another Character
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
