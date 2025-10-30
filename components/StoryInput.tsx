'use client';

import Image from 'next/image';

interface StoryInputProps {
  characterImage: string;
  characterName: string;
  script: string;
  onScriptChange: (script: string) => void;
  maxLength?: number;
}

const examplePrompts = [
  "Tell us about your day...",
  "Share a story about something fun...",
  "Describe how you feel today...",
  "What did you learn today?...",
  "Tell me your favorite thing...",
];

export default function StoryInput({
  characterImage,
  characterName,
  script,
  onScriptChange,
  maxLength = 500,
}: StoryInputProps) {
  const randomPrompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Character Preview */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Your Character</h3>
        <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg mb-6">
          <Image
            src={characterImage}
            alt={characterName}
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">{characterName}</h4>
          <p className="text-gray-600">is ready to talk!</p>
        </div>
      </div>

      {/* Script Input */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          What should {characterName} say?
        </h3>
        <p className="text-gray-600 mb-6">
          Write a script for your character. Keep it short and fun!
        </p>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="script" className="font-semibold text-gray-700">
              Your Script
            </label>
            <span className={`text-sm ${
              script.length > maxLength * 0.9
                ? 'text-red-600 font-bold'
                : 'text-gray-500'
            }`}>
              {script.length}/{maxLength}
            </span>
          </div>
          <textarea
            id="script"
            value={script}
            onChange={(e) => onScriptChange(e.target.value.slice(0, maxLength))}
            placeholder={randomPrompt}
            className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none resize-none text-lg"
            maxLength={maxLength}
          />
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-bold text-blue-900 mb-2 text-sm flex items-center">
            <span className="mr-2">💡</span>
            Tips for Great Scripts
          </h4>
          <ul className="space-y-1 text-xs text-blue-800">
            <li>• Keep it short and natural (like real speech)</li>
            <li>• Use simple, clear language</li>
            <li>• Perfect for teaching moments or stories</li>
            <li>• Avoid very long sentences</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
