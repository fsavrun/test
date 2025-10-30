'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCharacter } from '@/contexts/CharacterContext';
import { CharacterTemplate } from '@/types/templates';
import TemplateGallery from '@/components/TemplateGallery';

export default function TemplatesPage() {
  const router = useRouter();
  const { updateCharacter } = useCharacter();

  const handleTemplateSelect = (template: CharacterTemplate) => {
    // Create a data URL for the template character
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Fill background
      ctx.fillStyle = template.bgColor;
      ctx.fillRect(0, 0, 300, 400);

      // Draw emoji (this is a simple placeholder)
      ctx.font = '120px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(template.emoji, 150, 200);
    }

    const imageUrl = canvas.toDataURL('image/png');

    // Update character context
    updateCharacter({
      characterImage: imageUrl,
      isTemplate: true,
      templateId: template.id,
      characterName: template.name,
      backgroundColor: template.bgColor,
    });

    // Navigate to customization
    router.push('/create/customize');
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
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <span>Step 1 of 3</span>
          <span>•</span>
          <span className="font-semibold text-orange-600">Choose Character</span>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Character 🎭
          </h2>
          <p className="text-xl text-gray-700">
            Pick a character template to get started quickly!
          </p>
        </div>

        {/* Template Gallery */}
        <TemplateGallery onSelect={handleTemplateSelect} />

        {/* Alternative Option */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Or create a character from your own photo</p>
          <Link
            href="/create/upload"
            className="inline-flex items-center px-6 py-3 bg-white border-2 border-orange-400 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            📸 Upload Photo Instead
          </Link>
        </div>
      </main>
    </div>
  );
}
