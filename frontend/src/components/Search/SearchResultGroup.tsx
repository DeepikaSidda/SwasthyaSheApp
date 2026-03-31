import React from 'react';
import { Link } from 'react-router-dom';
import { SearchResult, SearchCategory } from '../../types';

interface SearchResultGroupProps {
  category: SearchCategory;
  results: SearchResult[];
}

/**
 * Category icons mapping
 */
const categoryIcons: Record<SearchCategory, React.ReactNode> = {
  articles: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  remedies: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  forum: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
  ),
  diet: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
};

/**
 * Category display names
 */
const categoryNames: Record<SearchCategory, string> = {
  articles: 'Articles',
  remedies: 'Ayurvedic Remedies',
  forum: 'Community Forum',
  diet: 'Diet Plans',
};

/**
 * Category colors for styling
 */
const categoryColors: Record<SearchCategory, string> = {
  articles: 'text-blue-600 bg-blue-50',
  remedies: 'text-green-600 bg-green-50',
  forum: 'text-purple-600 bg-purple-50',
  diet: 'text-orange-600 bg-orange-50',
};

/**
 * Converts **term** markers to highlighted spans
 * The API returns snippets with **term** markers for highlighting
 */
const renderHighlightedText = (text: string): React.ReactNode => {
  // Split by **term** pattern
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  
  return parts.map((part, index) => {
    // Odd indices are the matched terms (inside **)
    if (index % 2 === 1) {
      return (
        <mark key={index} className="bg-yellow-200 text-gray-900 px-0.5 rounded">
          {part}
        </mark>
      );
    }
    return part;
  });
};

/**
 * SearchResultGroup component displays a group of search results for one category
 */
const SearchResultGroup: React.FC<SearchResultGroupProps> = ({ category, results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Category Header */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${categoryColors[category]} mb-3`}>
        {categoryIcons[category]}
        <h3 className="font-semibold">{categoryNames[category]}</h3>
        <span className="text-sm opacity-75">({results.length})</span>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.map((result) => (
          <Link
            key={result.id}
            to={result.url}
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
          >
            <h4 className="text-lg font-medium text-gray-900 mb-1">
              {renderHighlightedText(result.title)}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {renderHighlightedText(result.snippet)}
            </p>
            {result.matchedTerms.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {result.matchedTerms.map((term, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                  >
                    {term}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResultGroup;
