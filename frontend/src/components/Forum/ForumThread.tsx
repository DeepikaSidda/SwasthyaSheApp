import React from 'react';

interface ForumThreadProps {
  title: string;
  author: string;
  date: string;
  content: string;
  replies: number;
  tags: string[];
}

const ForumThread: React.FC<ForumThreadProps> = ({ title, author, date, content, replies, tags }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-purple-700">{title}</h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="text-gray-600 mb-4">{content}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>By: {author}</span>
        <span>{replies} replies</span>
      </div>
    </div>
  );
};

export default ForumThread;