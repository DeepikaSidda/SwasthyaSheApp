import React, { useState, useEffect, useCallback } from 'react';
import { ForumThread, ForumReply, ForumCategory } from '../types';
import ForumThreadList from '../components/Forum/ForumThreadList';
import ForumCategoryFilter from '../components/Forum/ForumCategoryFilter';
import ThreadDetail from '../components/Forum/ThreadDetail';
import CreateThread from '../components/Forum/CreateThread';
import { useAuth } from '../contexts/AuthContext';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

// Demo mode flag - set to true when API is unavailable
const USE_DEMO_MODE = false;

// Demo data for testing without backend
const generateDemoForumData = (): ForumThread[] => {
  return [];
};

const generateDemoReplies = (): ForumReply[] => {
  return [];
};

// --- Membership helper functions ---

export function isCommunityMember(_userId: string): boolean {
  return false;
}

export function joinCommunity(_userId: string): void {
  // no-op
}

const ForumPage: React.FC = () => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { user, signIn } = useAuth();
  const [isMember, setIsMember] = useState(false);

  // Check membership status on mount and when user changes
  useEffect(() => {
    if (user) {
      setIsMember(isCommunityMember(user.sub));
    } else {
      setIsMember(false);
    }
  }, [user]);

  const handleJoinCommunity = () => {
    if (user) {
      joinCommunity(user.sub);
      setIsMember(true);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [isLoading]);

  // Fetch threads from API
  const fetchThreads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use demo mode if enabled
      if (USE_DEMO_MODE) {
        let demoThreads = generateDemoForumData();
        if (selectedCategory) {
          demoThreads = demoThreads.filter(t => t.tags.includes(selectedCategory));
        }
        setThreads(demoThreads);
        setIsLoading(false);
        return;
      }
      
      let url = `${API_ENDPOINT}/forum/threads`;
      if (selectedCategory) {
        url += `?category=${encodeURIComponent(selectedCategory)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      const data = await response.json();
      setThreads(data.threads || data.items || []);
    } catch (err) {
      // Fallback to demo data
      console.warn('API unavailable, using demo data');
      let demoThreads = generateDemoForumData();
      if (selectedCategory) {
        demoThreads = demoThreads.filter(t => t.tags.includes(selectedCategory));
      }
      setThreads(demoThreads);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  // Fetch thread details with replies
  const fetchThreadDetails = async (threadId: string) => {
    try {
      // Use demo mode if enabled
      if (USE_DEMO_MODE) {
        const demoThreads = generateDemoForumData();
        const thread = demoThreads.find(t => t.threadId === threadId);
        if (thread) {
          setSelectedThread(thread);
          setReplies(generateDemoReplies().filter(r => r.threadId === threadId));
        }
        return;
      }
      
      const response = await fetch(`${API_ENDPOINT}/forum/threads/${threadId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch thread details');
      }
      const data = await response.json();
      setSelectedThread(data.thread || data);
      setReplies(data.replies || data.items || []);
    } catch (err) {
      // Fallback to demo data
      const demoThreads = generateDemoForumData();
      const thread = demoThreads.find(t => t.threadId === threadId);
      if (thread) {
        setSelectedThread(thread);
        setReplies(generateDemoReplies().filter(r => r.threadId === threadId));
      }
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // Handle thread selection
  const handleThreadSelect = (threadId: string) => {
    fetchThreadDetails(threadId);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedThread(null);
    setReplies([]);
  };

  // Handle category filter
  const handleCategorySelect = (category: ForumCategory | null) => {
    setSelectedCategory(category);
    setSelectedThread(null);
    setReplies([]);
  };

  // Handle thread creation
  const handleCreateThread = async (threadData: {
    title: string;
    content: string;
    tags: ForumCategory[];
  }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const threadPayload = {
        ...threadData,
        authorId: user?.sub || 'anonymous',
        authorName: user?.name || 'Anonymous User',
      };

      if (!USE_DEMO_MODE && API_ENDPOINT) {
        try {
          const response = await fetch(`${API_ENDPOINT}/forum/threads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(threadPayload),
          });
          if (response.ok) {
            setShowCreateForm(false);
            fetchThreads();
            return;
          }
          console.warn('API create thread failed, falling back to local:', response.status);
        } catch (fetchErr) {
          console.warn('API unreachable for create, falling back to local:', fetchErr);
        }
      }

      // Fallback: create locally
      const newThread: ForumThread = {
        PK: `THREAD#thread-${Date.now()}`,
        SK: 'METADATA',
        threadId: `thread-${Date.now()}`,
        title: threadData.title,
        content: threadData.content,
        authorId: threadPayload.authorId,
        authorName: threadPayload.authorName,
        tags: threadData.tags,
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        replyCount: 0,
      };
      setThreads(prev => [newThread, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create thread. Please try again.');
      console.error('Error creating thread:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (content: string) => {
    if (!selectedThread) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      const replyPayload = {
        content,
        authorId: user?.sub || 'anonymous',
        authorName: user?.name || 'Anonymous User',
      };

      if (!USE_DEMO_MODE && API_ENDPOINT) {
        try {
          const response = await fetch(
            `${API_ENDPOINT}/forum/threads/${selectedThread.threadId}/replies`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(replyPayload),
            }
          );
          if (response.ok) {
            fetchThreadDetails(selectedThread.threadId);
            return;
          }
          console.warn('API reply failed, falling back to local:', response.status);
        } catch (fetchErr) {
          console.warn('API unreachable for reply, falling back to local:', fetchErr);
        }
      }

      // Fallback: add locally
      const newReply: ForumReply = {
        PK: `THREAD#${selectedThread.threadId}`,
        SK: `REPLY#reply-${Date.now()}`,
        replyId: `reply-${Date.now()}`,
        threadId: selectedThread.threadId,
        content,
        authorId: replyPayload.authorId,
        authorName: replyPayload.authorName,
        createdAt: new Date().toISOString(),
      };
      setReplies(prev => [...prev, newReply]);
    } catch (err) {
      setError('Failed to post reply. Please try again.');
      console.error('Error posting reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className={`mb-6 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
          Community Forum
        </h1>
        <p className="text-gray-600">
          Connect with other women, share experiences, and find support in our community.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-shake">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
          >
            ×
          </button>
        </div>
      )}

      {/* Auth / Membership prompts */}
      {!user && (
        <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
          <p className="text-purple-700">Sign in to participate in the community forum.</p>
          <button
            onClick={signIn}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      {user && !isMember && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <p className="text-green-700">Join the community to create threads and post replies.</p>
          <button
            onClick={handleJoinCommunity}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Join Community
          </button>
        </div>
      )}

      {selectedThread ? (
        <div className="animate-slideIn">
          <ThreadDetail
            thread={selectedThread}
            replies={replies}
            onReplySubmit={user && isMember ? handleReplySubmit : () => {}}
            onBack={handleBackToList}
            isSubmitting={isSubmitting || !user || !isMember}
          />
        </div>
      ) : showCreateForm ? (
        <div className="animate-slideIn">
          <CreateThread
            onSubmit={handleCreateThread}
            onCancel={() => setShowCreateForm(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <>
          <div className={`flex justify-between items-center mb-4 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <ForumCategoryFilter
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            {user && isMember && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center hover:scale-105 hover:shadow-lg active:scale-95 group"
              >
                <svg
                  className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90 duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Thread
              </button>
            )}
          </div>

          <div className={`transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <ForumThreadList
              threads={threads}
              onThreadSelect={handleThreadSelect}
              isLoading={isLoading}
            />
          </div>
        </>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ForumPage;
