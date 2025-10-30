'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ProgressIndicatorProps {
  characterImage?: string;
  characterName?: string;
  message?: string;
}

export default function ProgressIndicator({
  characterImage,
  characterName,
  message = "Creating your cartoon... This takes about 60 seconds",
}: ProgressIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + 1;
      });
    }, 600);

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-12">
      {/* Character Preview (if provided) */}
      {characterImage && (
        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg animate-pulse">
            <Image
              src={characterImage}
              alt={characterName || 'Character'}
              fill
              className="object-cover"
            />
          </div>
          {characterName && (
            <p className="text-center mt-4 text-xl font-bold text-gray-900">
              {characterName}
            </p>
          )}
        </div>
      )}

      {/* Loading Animation */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full mb-6 animate-bounce">
          <span className="text-5xl">🎬</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {message}{dots}
        </h3>
        <p className="text-gray-600">
          Please wait while we work our magic!
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center mt-2 text-sm text-gray-600">{progress}%</p>
      </div>

      {/* Fun Messages */}
      <div className="mt-8 text-center">
        <div className="inline-block bg-yellow-50 rounded-lg px-6 py-3">
          <p className="text-sm text-yellow-800">
            {progress < 30 && "🎨 Preparing your character..."}
            {progress >= 30 && progress < 60 && "🎤 Adding the voice..."}
            {progress >= 60 && progress < 90 && "✨ Making the magic happen..."}
            {progress >= 90 && "🎉 Almost done!"}
          </p>
        </div>
      </div>
    </div>
  );
}
