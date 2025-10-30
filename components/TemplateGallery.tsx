'use client';

import { characterTemplates, CharacterTemplate } from '@/types/templates';

interface TemplateGalleryProps {
  onSelect: (template: CharacterTemplate) => void;
}

export default function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {characterTemplates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template)}
          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-4 border-transparent hover:border-orange-400 hover:-translate-y-2"
        >
          {/* Character Display */}
          <div
            className="w-full h-64 flex items-center justify-center relative"
            style={{ backgroundColor: template.bgColor }}
          >
            <span className="text-9xl transform group-hover:scale-110 transition-transform duration-300">
              {template.emoji}
            </span>
          </div>

          {/* Character Info */}
          <div className="p-4 bg-white">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {template.description}
            </p>
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              {template.category}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-orange-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                <span className="font-bold text-orange-600">Select Character</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
