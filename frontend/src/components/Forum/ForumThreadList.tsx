import React from 'react';
import { ForumThread } from '../../types';

interface ForumThreadListProps {
  threads: ForumThread[];
  onThreadSelect: (threadId: string) => void;
  isLoading: boolean;
}

const ForumThreadList: React.FC<ForumThreadListProps> = ({
  threads,
  onThreadSelect,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading threads...</span>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No threads yet</h3>
        <p className="mt-2 text-gray-500">Be the first to start a discussion!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <div
          key={thread.threadId}
          onClick={() => onThreadSelect(thread.threadId)}
          className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 hover:border-purple-200"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-purple-700 hover:text-purple-800">
              {thread.title}
            </h3>
            <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
              {formatDate(thread.createdAt)}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">{thread.content}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {thread.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>By: {thread.authorName}</span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumThreadList;
