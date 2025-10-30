'use client';

import Image from 'next/image';
import { emotions, backgroundColors } from '@/types/templates';

interface CharacterCustomizerProps {
  characterImage: string;
  characterName: string;
  emotion: string;
  backgroundColor: string;
  onNameChange: (name: string) => void;
  onEmotionChange: (emotion: string) => void;
  onBackgroundChange: (color: string) => void;
}

export default function CharacterCustomizer({
  characterImage,
  characterName,
  emotion,
  backgroundColor,
  onNameChange,
  onEmotionChange,
  onBackgroundChange,
}: CharacterCustomizerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Preview */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Preview</h3>
        <div
          className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg transition-colors duration-300"
          style={{ backgroundColor }}
        >
          <Image
            src={characterImage}
            alt="Character preview"
            fill
            className="object-cover"
          />
        </div>
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {characterName || 'Your Character'}
          </p>
          <p className="text-gray-600">
            {emotions.find(e => e.value === emotion)?.label || 'Happy'}
          </p>
        </div>
      </div>

      {/* Customization Options */}
      <div className="space-y-6">
        {/* Character Name */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Character Name
          </label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter a name..."
            maxLength={30}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
          />
          <p className="mt-2 text-sm text-gray-500">
            {characterName.length}/30 characters
          </p>
        </div>

        {/* Emotion Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Emotion / Expression
          </label>
          <div className="grid grid-cols-2 gap-3">
            {emotions.map((emo) => (
              <button
                key={emo.value}
                onClick={() => onEmotionChange(emo.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  emotion === emo.value
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                <div className="text-3xl mb-1">{emo.label.split(' ')[0]}</div>
                <div className="text-sm font-semibold text-gray-700">
                  {emo.label.split(' ').slice(1).join(' ')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Background Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {backgroundColors.map((bg) => (
              <button
                key={bg.value}
                onClick={() => onBackgroundChange(bg.value)}
                className={`relative aspect-square rounded-xl transition-all ${
                  backgroundColor === bg.value
                    ? 'ring-4 ring-orange-500 ring-offset-2 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: bg.color }}
                title={bg.label}
              >
                {backgroundColor === bg.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
