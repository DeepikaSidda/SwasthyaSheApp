import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SearchResultGroup } from '../components/Search';
import { SearchResult, SearchCategory } from '../types';

interface SearchResponse {
  query: string;
  categories: SearchCategory[];
  totalResults: number;
  results: {
    articles: SearchResult[];
    remedies: SearchResult[];
    forum: SearchResult[];
    diet: SearchResult[];
  };
}

/**
 * SearchResults page component
 * Displays search results grouped by category
 */
const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && searchResponse) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [isLoading, searchResponse]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 2) {
        setSearchResponse(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const localData: { type: 'articles' | 'remedies' | 'forum' | 'diet'; items: { id: string; type: 'articles' | 'remedies' | 'forum' | 'diet'; title: string; snippet: string; url: string; matchedTerms: string[] }[] }[] = [
          { type: 'articles', items: [
            { id: 'a1', type: 'articles', title: 'Understanding Your Menstrual Cycle', snippet: 'Learn about the phases of your menstrual cycle and how to track them for better health.', url: '/period-health', matchedTerms: ['period', 'menstrual', 'cycle'] },
            { id: 'a2', type: 'articles', title: 'Yoga for Stress Relief', snippet: 'Simple yoga poses to calm your mind and reduce anxiety naturally.', url: '/mental-wellness', matchedTerms: ['yoga', 'stress', 'mental'] },
            { id: 'a3', type: 'articles', title: 'Prenatal Nutrition Guide', snippet: 'Essential nutrients and diet tips during pregnancy for mother and baby.', url: '/pregnancy-care', matchedTerms: ['pregnancy', 'nutrition', 'prenatal'] },
            { id: 'a4', type: 'articles', title: 'Reproductive Health Basics', snippet: 'Essential information about reproductive wellness and care.', url: '/sexual-health', matchedTerms: ['reproductive', 'health', 'sexual'] },
            { id: 'a5', type: 'articles', title: 'Blood Color Guide', snippet: 'Understanding what different menstrual blood colors mean for your health.', url: '/blood-color-guide', matchedTerms: ['blood', 'period', 'menstrual'] },
          ]},
          { type: 'remedies', items: [
            { id: 'r1', type: 'remedies', title: 'Natural Remedies for Period Pain', snippet: 'Ayurvedic herbs and home remedies to ease menstrual cramps and discomfort.', url: '/period-health', matchedTerms: ['period', 'pain', 'remedies'] },
            { id: 'r2', type: 'remedies', title: 'Natural Skin Care Routines', snippet: 'Ayurvedic beauty secrets for glowing, healthy skin.', url: '/skin-care', matchedTerms: ['skin', 'care', 'ayurvedic'] },
            { id: 'r3', type: 'remedies', title: 'Hair Care with Natural Oils', snippet: 'Traditional oil treatments for healthy, strong hair.', url: '/hair-care', matchedTerms: ['hair', 'oil', 'natural'] },
            { id: 'r4', type: 'remedies', title: 'Ayurvedic Mental Health', snippet: 'Traditional approaches to mental well-being and emotional balance.', url: '/aryurvedic-mental-health', matchedTerms: ['ayurvedic', 'mental', 'health'] },
          ]},
          { type: 'diet', items: [
            { id: 'd1', type: 'diet', title: 'Dosha-Based Diet Plans', snippet: 'Personalized meal plans based on your Ayurvedic body type.', url: '/wellness-planner', matchedTerms: ['dosha', 'diet', 'wellness'] },
            { id: 'd2', type: 'diet', title: 'Immunity Boosting Foods', snippet: 'Traditional foods that strengthen your immune system naturally.', url: '/diet-plan', matchedTerms: ['immunity', 'food', 'diet'] },
          ]},
          { type: 'forum', items: [
            { id: 'f1', type: 'forum', title: 'Community Discussions', snippet: 'Join conversations about women health topics with our community.', url: '/community-forum', matchedTerms: ['community', 'forum', 'discussion'] },
          ]},
        ];

        const q = query.toLowerCase();
        const articles = localData.find(d => d.type === 'articles')!.items.filter(i => i.title.toLowerCase().includes(q) || i.snippet.toLowerCase().includes(q) || i.matchedTerms.some(t => t.includes(q)));
        const remedies = localData.find(d => d.type === 'remedies')!.items.filter(i => i.title.toLowerCase().includes(q) || i.snippet.toLowerCase().includes(q) || i.matchedTerms.some(t => t.includes(q)));
        const diet = localData.find(d => d.type === 'diet')!.items.filter(i => i.title.toLowerCase().includes(q) || i.snippet.toLowerCase().includes(q) || i.matchedTerms.some(t => t.includes(q)));
        const forum = localData.find(d => d.type === 'forum')!.items.filter(i => i.title.toLowerCase().includes(q) || i.snippet.toLowerCase().includes(q) || i.matchedTerms.some(t => t.includes(q)));

        const totalResults = articles.length + remedies.length + diet.length + forum.length;
        const cats: ('articles' | 'remedies' | 'forum' | 'diet')[] = [];
        if (articles.length) cats.push('articles');
        if (remedies.length) cats.push('remedies');
        if (diet.length) cats.push('diet');
        if (forum.length) cats.push('forum');

        setSearchResponse({
          query,
          totalResults,
          categories: cats,
          results: { articles, remedies, forum, diet }
        });
      } catch (err) {
        console.error('Search error:', err);
        setError('Unable to perform search. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // No query provided
  if (!query) {
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 animate-bounce-slow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Search Health Topics
          </h2>
          <p className="mt-2 text-gray-600">
            Enter a search term to find articles, remedies, forum discussions, and diet plans.
          </p>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Query too short
  if (query.length < 2) {
    return (
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="text-center py-12">
          <p className="text-gray-600">
            Please enter at least 2 characters to search.
          </p>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <div className={`mb-6 transition-all duration-500 ${isVisible || isLoading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Search Results
        </h1>
        <p className="text-gray-600 mt-1">
          {isLoading ? (
            <span className="animate-pulse">Searching...</span>
          ) : searchResponse ? (
            <>
              Found <span className="font-semibold">{searchResponse.totalResults}</span> results for "
              <span className="font-semibold">{query}</span>"
            </>
          ) : (
            `Searching for "${query}"...`
          )}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg animate-pulse">🔍</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 animate-pulse">Searching...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-shake">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && searchResponse && (
        <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {searchResponse.totalResults === 0 ? (
            <NoResultsMessage query={query} />
          ) : (
            <div className="space-y-4">
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <SearchResultGroup
                  category="articles"
                  results={searchResponse.results.articles}
                />
              </div>
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <SearchResultGroup
                  category="remedies"
                  results={searchResponse.results.remedies}
                />
              </div>
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <SearchResultGroup
                  category="forum"
                  results={searchResponse.results.forum}
                />
              </div>
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <SearchResultGroup
                  category="diet"
                  results={searchResponse.results.diet}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

/**
 * No results message with suggestions
 */
const NoResultsMessage: React.FC<{ query: string }> = ({ query }) => {
  const suggestions = [
    { text: 'Period Health', url: '/period-health' },
    { text: 'Natural Remedies', url: '/natural-remedies' },
    { text: 'Mental Wellness', url: '/mental-wellness' },
    { text: 'Diet Plans', url: '/diet-plan' },
  ];

  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg animate-fadeIn">
      <svg
        className="mx-auto h-12 w-12 text-gray-400 animate-bounce-slow"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        No results found for "{query}"
      </h3>
      <p className="mt-2 text-gray-600 max-w-md mx-auto">
        Try different keywords or check out these popular topics:
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion, index) => (
          <Link
            key={suggestion.url}
            to={suggestion.url}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {suggestion.text}
          </Link>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
