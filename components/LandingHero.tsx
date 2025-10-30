'use client';

import Link from 'next/link';

export default function LandingHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                Tolly
              </h1>
            </div>
            <Link
              href="/manual-upload"
              className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
            >
              Admin Upload
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Hero Icon */}
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-8">
            <span className="text-6xl">🎬</span>
          </div>

          {/* Hero Title */}
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Your Cartoon Character
          </h2>

          {/* Hero Description */}
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Bring your stories to life with talking cartoon characters!
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Perfect for parents, teachers, and kids. Create fun videos in minutes! 🌟
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="/create/upload"
              className="group w-full sm:w-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-4 border-orange-400 hover:border-orange-500 hover:-translate-y-1">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Photo</h3>
                <p className="text-gray-600 mb-4">
                  Turn any photo into a cartoon character
                </p>
                <div className="inline-flex items-center text-orange-600 font-semibold">
                  Get Started
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link
              href="/create/templates"
              className="group w-full sm:w-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-4 border-yellow-400 hover:border-yellow-500 hover:-translate-y-1">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Browse Templates</h3>
                <p className="text-gray-600 mb-4">
                  Choose from ready-made characters
                </p>
                <div className="inline-flex items-center text-yellow-600 font-semibold">
                  Explore Templates
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-orange-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Choose</h4>
                <p className="text-sm text-gray-600">Pick a template or upload your photo</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-orange-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Customize</h4>
                <p className="text-sm text-gray-600">Add a name and choose emotions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-orange-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Write Story</h4>
                <p className="text-sm text-gray-600">Create what they should say</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-orange-600">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Watch & Share</h4>
                <p className="text-sm text-gray-600">Enjoy your talking video!</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-semibold text-gray-900 mb-2">Super Fast</h4>
              <p className="text-sm text-gray-600">Create videos in under 2 minutes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
              <h4 className="font-semibold text-gray-900 mb-2">Family Friendly</h4>
              <p className="text-sm text-gray-600">Safe and fun for all ages</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h4 className="font-semibold text-gray-900 mb-2">Educational</h4>
              <p className="text-sm text-gray-600">Perfect for teaching and learning</p>
            </div>
          </div>
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
