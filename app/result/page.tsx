'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCharacter } from '@/contexts/CharacterContext';
import VideoPlayer from '@/components/VideoPlayer';

export default function ResultPage() {
  const router = useRouter();
  const { character, resetCharacter } = useCharacter();

  useEffect(() => {
    // Redirect if no video
    if (!character.videoUrl) {
      router.push('/');
    }
  }, [character.videoUrl, router]);

  if (!character.videoUrl) {
    return null;
  }

  const handleDownload = () => {
    if (!character.videoUrl) return;
    const link = document.createElement('a');
    link.href = character.videoUrl;
    link.download = `${character.characterName || 'tolly-video'}.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateAnother = () => {
    resetCharacter();
    router.push('/');
  };

  const handleShare = () => {
    if (!character.videoUrl) return;
    // Simple share - copy video URL to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(character.videoUrl);
      alert('Video link copied to clipboard! 🎉');
    } else {
      alert('Video URL: ' + character.videoUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                Tolly
              </h1>
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Badge */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-8">
          <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Video Created Successfully!</span>
          </div>
        </div>

        {/* Video Player */}
        <VideoPlayer
          videoUrl={character.videoUrl}
          characterName={character.characterName}
          onDownload={handleDownload}
          onCreateAnother={handleCreateAnother}
          onShare={handleShare}
        />

        {/* Character Info Summary */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">Video Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Character Name:</span>
              <p className="font-semibold text-gray-900">{character.characterName}</p>
            </div>
            <div>
              <span className="text-gray-600">Emotion:</span>
              <p className="font-semibold text-gray-900 capitalize">{character.emotion}</p>
            </div>
            <div>
              <span className="text-gray-600">Source:</span>
              <p className="font-semibold text-gray-900">
                {character.isTemplate ? 'Template' : 'Photo Upload'}
              </p>
            </div>
          </div>
          {character.script && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-gray-600 text-sm">Script:</span>
              <p className="text-gray-900 mt-1">{character.script}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            Made with 🧡 for parents, teachers, and storytellers
          </p>
        </div>
      </footer>
    </div>
  );
}
