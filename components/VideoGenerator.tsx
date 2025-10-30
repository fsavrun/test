'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

interface VideoGeneratorProps {
  characterImageUrl: string | null;
}

export default function VideoGenerator({ characterImageUrl }: VideoGeneratorProps) {
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const MAX_SCRIPT_LENGTH = 500;

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const pollVideoStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/video/status?videoId=${id}`);
      const data = await response.json();

      console.log('Video status:', data);

      if (data.status === 'done' && data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setIsGenerating(false);
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
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
    if (!script.trim() || !characterImageUrl) return;

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: script.trim(),
          imageUrl: characterImageUrl,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate video');
      }

      // If video is already done
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setIsGenerating(false);
      } else if (data.videoId) {
        // Start polling for video status
        setVideoId(data.videoId);
        const interval = setInterval(() => pollVideoStatus(data.videoId), 3000);
        setPollingInterval(interval);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video');
      setIsGenerating(false);
    }
  };

  const handleDownloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'tolly-video.mp4';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setScript('');
    setVideoUrl(null);
    setVideoId(null);
    setError(null);
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  if (!characterImageUrl) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-lg p-6 text-center">
        <div className="text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Create a Character First
          </h3>
          <p className="text-gray-600">
            Upload a photo and create your cartoon character to make a talking video
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Make Your Character Talk
      </h2>
      <p className="text-gray-600 mb-6">
        Enter a script and watch your character come to life!
      </p>

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} onClose={() => setError(null)} />
        </div>
      )}

      {!videoUrl && !isGenerating && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="script"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Script ({script.length}/{MAX_SCRIPT_LENGTH} characters)
            </label>
            <textarea
              id="script"
              value={script}
              onChange={(e) => setScript(e.target.value.slice(0, MAX_SCRIPT_LENGTH))}
              placeholder="Enter what you want your character to say... (max 500 characters)"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={MAX_SCRIPT_LENGTH}
            />
            <p className="mt-2 text-sm text-gray-500">
              Tip: Keep it short and fun! Perfect for educational content or storytelling.
            </p>
          </div>

          <button
            onClick={handleGenerateVideo}
            disabled={!script.trim() || script.length === 0}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors shadow-md ${
              script.trim() && script.length > 0
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Generate Talking Video
          </button>
        </div>
      )}

      {isGenerating && (
        <LoadingSpinner text="Creating your talking video... This may take 1-2 minutes!" />
      )}

      {videoUrl && (
        <div className="space-y-4">
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              src={videoUrl}
              controls
              className="w-full"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleDownloadVideo}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              Download Video
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Create Another Video
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Your video is ready! You can play it, download it, or create another one.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
