import React from 'react';
import { ForumCategory, FORUM_CATEGORIES } from '../../types';

interface ForumCategoryFilterProps {
  selectedCategory: ForumCategory | null;
  onCategorySelect: (category: ForumCategory | null) => void;
}

const ForumCategoryFilter: React.FC<ForumCategoryFilterProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {FORUM_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default ForumCategoryFilter;
