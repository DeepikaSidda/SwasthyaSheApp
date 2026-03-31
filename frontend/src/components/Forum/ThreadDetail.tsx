import React, { useState } from 'react';
import { ForumThread, ForumReply } from '../../types';

interface ThreadDetailProps {
  thread: ForumThread;
  replies: ForumReply[];
  onReplySubmit: (content: string) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const ThreadDetail: React.FC<ThreadDetailProps> = ({
  thread,
  replies,
  onReplySubmit,
  onBack,
  isSubmitting = false,
}) => {
  const [replyContent, setReplyContent] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReplySubmit(replyContent);
      setReplyContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to threads
      </button>

      {/* Thread Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-purple-700">{thread.title}</h2>
          <span className="text-sm text-gray-500">{formatDate(thread.createdAt)}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {thread.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-700 whitespace-pre-wrap mb-4">{thread.content}</p>

        <div className="text-sm text-gray-500 border-t pt-4">
          Posted by <span className="font-medium">{thread.authorName}</span>
        </div>
      </div>

      {/* Replies Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Replies ({replies.length})
        </h3>

        {replies.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No replies yet. Be the first to respond!
          </p>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => (
              <div
                key={reply.replyId}
                className="border-l-4 border-purple-200 pl-4 py-2"
              >
                <p className="text-gray-700 mb-2">{reply.content}</p>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{reply.authorName}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(reply.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a Reply</h3>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows={4}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting || !replyContent.trim()}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post Reply'}
        </button>
      </form>
    </div>
  );
};

export default ThreadDetail;
