'use client';

import { useState } from 'react';
import CharacterCreator from '@/components/CharacterCreator';
import VideoGenerator from '@/components/VideoGenerator';

export default function Home() {
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Tolly
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Create Cartoon Characters & Talking Videos
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Bring Your Stories to Life!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Perfect for parents and teachers! Upload a photo to create a fun cartoon character,
            then make it talk with your own script. Great for storytelling, education, and creative fun.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Create Your Character</h4>
                  <p className="text-gray-600 text-sm">
                    Upload any photo and our AI will transform it into a friendly cartoon character
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Make It Talk</h4>
                  <p className="text-gray-600 text-sm">
                    Write a script and watch your character come to life in a talking video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Character Creator */}
          <div>
            <CharacterCreator onCharacterCreated={setCharacterImageUrl} />
          </div>

          {/* Video Generator */}
          <div>
            <VideoGenerator characterImageUrl={characterImageUrl} />
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <svg
              className="w-5 h-5 text-blue-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Tips for Best Results
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Use clear, well-lit photos with faces clearly visible</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Keep scripts short and natural - perfect for teaching moments or fun stories</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Video generation takes 1-2 minutes - patience makes perfect!</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Download your videos to share with friends and family</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              Powered by AI • Made with care for parents and teachers
            </p>
            <p className="text-xs text-gray-500">
              Tolly uses Replicate and D-ID APIs to create amazing cartoon characters and videos
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
