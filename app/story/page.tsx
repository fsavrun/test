'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCharacter } from '@/contexts/CharacterContext';
import StoryInput from '@/components/StoryInput';
import ProgressIndicator from '@/components/ProgressIndicator';
import ErrorAlert from '@/components/ErrorAlert';

export default function StoryPage() {
  const router = useRouter();
  const { character, updateCharacter } = useCharacter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoSource, setVideoSource] = useState<'generate' | 'manual'>('generate');
  const [manualVideos, setManualVideos] = useState<any[]>([]);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Redirect if no character
    if (!character.characterImage || !character.characterName) {
      router.push('/');
    }

    // Load manual videos
    loadManualVideos();

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [character.characterImage, character.characterName, router, pollingInterval]);

  const loadManualVideos = async () => {
    try {
      const response = await fetch('/api/upload-manual');
      if (response.ok) {
        const data = await response.json();
        setManualVideos(data.videos || []);
      }
    } catch (err) {
      console.error('Failed to load manual videos:', err);
    }
  };

  const pollVideoStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/video/status?videoId=${id}`);
      const data = await response.json();

      if (data.status === 'done' && data.videoUrl) {
        updateCharacter({ videoUrl: data.videoUrl });
        setIsGenerating(false);
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        router.push('/result');
      } else if (data.status === 'error') {
        setError(data.error || 'Video generation failed');
        setIsGenerating(false);
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      }
    } catch (err) {
      console.error('Error polling video status:', err);
      setError('Failed to check video status');
      setIsGenerating(false);
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  };

  const handleGenerateVideo = async () => {
    if (!character.script.trim()) {
      alert('Please enter a script!');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: character.script.trim(),
          imageUrl: character.characterImage,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate video');
      }

      if (data.videoUrl) {
        updateCharacter({ videoUrl: data.videoUrl });
        router.push('/result');
      } else if (data.videoId) {
        const interval = setInterval(() => pollVideoStatus(data.videoId), 3000);
        setPollingInterval(interval);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video');
      setIsGenerating(false);
    }
  };

  const handleManualVideoSelect = (videoId: string) => {
    const video = manualVideos.find(v => v.id === videoId);
    if (video) {
      updateCharacter({ videoUrl: video.videoUrl, script: video.script });
      router.push('/result');
    }
  };

  if (!character.characterImage || !character.characterName) {
    return null;
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <ProgressIndicator
            characterImage={character.characterImage}
            characterName={character.characterName}
            message="Creating your talking video... This takes about 60 seconds"
          />
        </div>
      </div>
    );
  }

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
              href="/create/customize"
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
          <span>Step 3 of 3</span>
          <span>•</span>
          <span className="font-semibold text-orange-600">Create Story</span>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Write Your Story 📝
          </h2>
          <p className="text-xl text-gray-700">
            What should {character.characterName} say?
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Video Source Selection */}
        {manualVideos.length > 0 && (
          <div className="mb-6 bg-white rounded-xl shadow-md p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Video Source:
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setVideoSource('generate')}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  videoSource === 'generate'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🎬 Generate New (AI)
              </button>
              <button
                onClick={() => setVideoSource('manual')}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  videoSource === 'manual'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📁 Use Uploaded Video
              </button>
            </div>
          </div>
        )}

        {videoSource === 'manual' && manualVideos.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Select a Manual Video
            </h3>
            <select
              onChange={(e) => handleManualVideoSelect(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
            >
              <option value="">Select uploaded video...</option>
              {manualVideos.map((video) => (
                <option key={video.id} value={video.id}>
                  {video.name} - {video.script.slice(0, 50)}...
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            {/* Story Input */}
            <StoryInput
              characterImage={character.characterImage}
              characterName={character.characterName}
              script={character.script}
              onScriptChange={(script) => updateCharacter({ script })}
            />

            {/* Generate Button */}
            <div className="mt-12 text-center">
              <button
                onClick={handleGenerateVideo}
                disabled={!character.script.trim()}
                className={`px-12 py-5 rounded-xl font-bold text-xl shadow-lg transition-all ${
                  character.script.trim()
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:-translate-y-1'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Generate Video 🎬
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
