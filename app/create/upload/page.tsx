'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCharacter } from '@/contexts/CharacterContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';

export default function UploadPage() {
  const router = useRouter();
  const { updateCharacter } = useCharacter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateCharacter = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    setIsProcessing(true);
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

      // Update character context
      updateCharacter({
        characterImage: data.imageUrl,
        isTemplate: false,
        templateId: null,
      });

      // Navigate to customization
      router.push('/create/customize');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTryAgain = () => {
    setSelectedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <span>Step 1 of 3</span>
          <span>•</span>
          <span className="font-semibold text-orange-600">Upload Photo</span>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upload Your Photo 📸
          </h2>
          <p className="text-xl text-gray-700">
            We'll turn it into an amazing cartoon character!
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Upload Area */}
        {!selectedImage && !isProcessing && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer flex flex-col items-center p-12 border-4 border-dashed border-orange-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              <div className="text-8xl mb-6">📷</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Click to Upload Photo
              </h3>
              <p className="text-gray-600 mb-4">
                PNG, JPG up to 10MB
              </p>
              <div className="bg-orange-100 text-orange-700 px-6 py-2 rounded-full font-semibold">
                Choose File
              </div>
            </label>

            {/* Tips */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <span className="text-xl mr-2">💡</span>
                Tips for Best Results
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Use a clear, well-lit photo</li>
                <li>• Face should be clearly visible</li>
                <li>• Close-up works better than distant shots</li>
                <li>• Avoid blurry or dark photos</li>
              </ul>
            </div>
          </div>
        )}

        {/* Preview & Process */}
        {selectedImage && !isProcessing && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="relative w-full max-w-md mx-auto aspect-square rounded-xl overflow-hidden mb-6">
              <Image
                src={selectedImage}
                alt="Selected photo"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTryAgain}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-lg"
              >
                Choose Different Photo
              </button>
              <button
                onClick={handleCreateCharacter}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors shadow-lg text-lg"
              >
                Create Character ✨
              </button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <LoadingSpinner text="Creating your cartoon character... This may take a minute! 🎨" />
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Our AI is working its magic to transform your photo into a fun cartoon character!
              </p>
            </div>
          </div>
        )}

        {/* Alternative Option */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Or choose from ready-made templates</p>
          <Link
            href="/create/templates"
            className="inline-flex items-center px-6 py-3 bg-white border-2 border-yellow-400 text-yellow-600 rounded-xl font-semibold hover:bg-yellow-50 transition-colors"
          >
            🎨 Browse Templates Instead
          </Link>
        </div>
      </main>
    </div>
  );
}
