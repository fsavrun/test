'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ErrorAlert from '@/components/ErrorAlert';

interface ManualVideo {
  id: string;
  name: string;
  script: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  uploadedAt: string;
}

export default function ManualUploadPage() {
  const [videos, setVideos] = useState<ManualVideo[]>([]);
  const [name, setName] = useState('');
  const [script, setScript] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/upload-manual');
      const data = await response.json();
      if (data.success) {
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const videoFile = videoInputRef.current?.files?.[0];
    const thumbnailFile = thumbnailInputRef.current?.files?.[0];

    if (!videoFile || !name) {
      setError('Video file and character name are required');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('name', name);
      formData.append('script', script);
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      const response = await fetch('/api/upload-manual', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to upload video');
      }

      setSuccess('Video uploaded successfully! 🎉');
      setName('');
      setScript('');
      if (videoInputRef.current) videoInputRef.current.value = '';
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';

      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await fetch(`/api/upload-manual?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete video');
      }

      setSuccess('Video deleted successfully');
      await loadVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete video');
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
                Tolly Admin
              </h1>
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Manual Video Upload</h2>
          <p className="text-gray-600">
            Upload pre-recorded videos for testing or when AI generation isn't available
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onClose={() => setError(null)} />
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload New Video</h3>
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Character Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter character name..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video File * (MP4, MOV, WebM - Max 50MB)
              </label>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thumbnail (Optional)
              </label>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Script / Description
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter script or description..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all ${
                isUploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Save Video'}
            </button>
          </form>
        </div>

        {/* Uploaded Videos List */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Uploaded Videos ({videos.length})
          </h3>

          {videos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500">No videos uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Video Thumbnail */}
                  <div className="bg-gray-900 aspect-video relative">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-1">{video.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {video.script || 'No description'}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      {new Date(video.uploadedAt).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 text-center"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
