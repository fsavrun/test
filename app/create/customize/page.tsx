'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCharacter } from '@/contexts/CharacterContext';
import CharacterCustomizer from '@/components/CharacterCustomizer';

export default function CustomizePage() {
  const router = useRouter();
  const { character, updateCharacter } = useCharacter();

  useEffect(() => {
    // Redirect if no character image
    if (!character.characterImage) {
      router.push('/');
    }
  }, [character.characterImage, router]);

  if (!character.characterImage) {
    return null;
  }

  const handleNext = () => {
    if (!character.characterName.trim()) {
      alert('Please enter a character name!');
      return;
    }
    router.push('/story');
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
              ← Start Over
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <span>Step 2 of 3</span>
          <span>•</span>
          <span className="font-semibold text-orange-600">Customize Character</span>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Customize Your Character ✨
          </h2>
          <p className="text-xl text-gray-700">
            Give your character a name and personality!
          </p>
        </div>

        {/* Customizer */}
        <CharacterCustomizer
          characterImage={character.characterImage}
          characterName={character.characterName}
          emotion={character.emotion}
          backgroundColor={character.backgroundColor}
          onNameChange={(name) => updateCharacter({ characterName: name })}
          onEmotionChange={(emotion) => updateCharacter({ emotion })}
          onBackgroundChange={(color) => updateCharacter({ backgroundColor: color })}
        />

        {/* Next Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleNext}
            disabled={!character.characterName.trim()}
            className={`px-12 py-5 rounded-xl font-bold text-xl shadow-lg transition-all ${
              character.characterName.trim()
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next: Create Story 📝
          </button>
        </div>
      </main>
    </div>
  );
}
