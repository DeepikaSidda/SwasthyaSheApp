import React, { useState } from 'react';
import { AyurvedicRecommendation, RecommendationType } from '../../types';

interface AyurvedicRecommendationsProps {
  recommendations: AyurvedicRecommendation[];
  byType: Record<RecommendationType, AyurvedicRecommendation[]>;
  disclaimer: string;
  loading?: boolean;
}

const AyurvedicRecommendations: React.FC<AyurvedicRecommendationsProps> = ({
  recommendations,
  byType,
  disclaimer,
  loading = false,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<RecommendationType>>(
    () => new Set<RecommendationType>(['herbal', 'dietary', 'yoga', 'lifestyle'])
  );

  const toggleSection = (type: RecommendationType) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const sectionConfig: Record<RecommendationType, { title: string; emoji: string; bgClass: string; hoverClass: string }> = {
    herbal: { title: 'Herbal Remedies', emoji: '🌿', bgClass: 'bg-green-50', hoverClass: 'hover:bg-green-100' },
    dietary: { title: 'Dietary Suggestions', emoji: '🍽️', bgClass: 'bg-orange-50', hoverClass: 'hover:bg-orange-100' },
    yoga: { title: 'Yoga & Breathing', emoji: '🧘', bgClass: 'bg-purple-50', hoverClass: 'hover:bg-purple-100' },
    lifestyle: { title: 'Lifestyle Tips', emoji: '✨', bgClass: 'bg-blue-50', hoverClass: 'hover:bg-blue-100' },
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🌺</span>
          </div>
          Ayurvedic Recommendations
        </h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🌸</div>
          <p className="text-gray-600">
            Log your symptoms to receive personalized Ayurvedic recommendations.
          </p>
        </div>
      </div>
    );
  }

  const renderRecommendation = (rec: AyurvedicRecommendation) => (
    <div key={rec.id} className="bg-white rounded-xl p-5 mb-3 last:mb-0 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      <h4 className="font-semibold text-gray-800 mb-2">{rec.title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed mb-2">{rec.description}</p>
      
      {rec.instructions && (
        <div className="mt-2">
          <span className="text-xs font-medium text-gray-500 uppercase">How to use:</span>
          <p className="text-sm text-gray-700 mt-1">{rec.instructions}</p>
        </div>
      )}
      
      {rec.cautions && (
        <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
          <span className="text-xs font-medium text-amber-700">⚠️ Caution:</span>
          <p className="text-sm text-amber-700 mt-1">{rec.cautions}</p>
        </div>
      )}
    </div>
  );

  const renderSection = (type: RecommendationType) => {
    const config = sectionConfig[type];
    const items = byType[type];
    const isExpanded = expandedSections.has(type);

    if (items.length === 0) return null;

    return (
      <div key={type} className="border border-gray-200 rounded-xl overflow-hidden mb-4 last:mb-0 shadow-sm">
        <button
          onClick={() => toggleSection(type)}
          className={`w-full px-5 py-4 flex items-center justify-between ${config.bgClass} ${config.hoverClass} transition-colors`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.emoji}</span>
            <span className="font-semibold text-gray-800">{config.title}</span>
            <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">({items.length})</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <div className="p-5 bg-gray-50/50">
            {items.map(renderRecommendation)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-sm">
          <span className="text-white text-lg">🌺</span>
        </div>
        Ayurvedic Recommendations
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Based on your logged symptoms, here are some traditional Ayurvedic remedies that may help:
      </p>

      <div className="space-y-4">
        {(['herbal', 'dietary', 'yoga', 'lifestyle'] as RecommendationType[]).map(renderSection)}
      </div>

      {/* Safety Disclaimer */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-medium text-amber-800 mb-1">Important Disclaimer</h4>
            <p className="text-sm text-amber-700">{disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AyurvedicRecommendations;
