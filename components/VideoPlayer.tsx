'use client';

interface VideoPlayerProps {
  videoUrl: string;
  characterName: string;
  onDownload: () => void;
  onCreateAnother: () => void;
  onShare?: () => void;
}

export default function VideoPlayer({
  videoUrl,
  characterName,
  onDownload,
  onCreateAnother,
  onShare,
}: VideoPlayerProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
          <span className="text-5xl">🎉</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Your Video is Ready!
        </h2>
        <p className="text-xl text-gray-700">
          {characterName} is talking!
        </p>
      </div>

      {/* Video Player */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
        <div className="bg-black">
          <video
            src={videoUrl}
            controls
            className="w-full"
            preload="metadata"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={onDownload}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <span className="inline-flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Video
          </span>
        </button>

        <button
          onClick={onCreateAnother}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <span className="inline-flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Another
          </span>
        </button>

        {onShare && (
          <button
            onClick={onShare}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <span className="inline-flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </span>
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <h4 className="font-bold text-blue-900 mb-2">
          🎓 Tips for Using Your Video
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Download and save your video to share with family and friends</li>
          <li>• Use it for teaching, storytelling, or creative projects</li>
          <li>• Create more characters and build a collection of videos!</li>
        </ul>
      </div>
    </div>
  );
}
