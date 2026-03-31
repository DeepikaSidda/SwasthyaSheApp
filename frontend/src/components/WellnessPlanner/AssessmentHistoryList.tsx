import React, { useState, useEffect, useCallback } from 'react';
import { AssessmentRecord, DoshaType } from '../../types';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

interface AssessmentHistoryListProps {
  userId: string;
  onSelectAssessment?: (assessment: AssessmentRecord) => void;
}

const getDoshaColor = (dosha: DoshaType) => {
  switch (dosha) {
    case 'vata': return { bg: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' };
    case 'pitta': return { bg: 'bg-red-500', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
    case 'kapha': return { bg: 'bg-green-500', text: 'text-green-700', badge: 'bg-green-100 text-green-800' };
  }
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const AssessmentHistoryList: React.FC<AssessmentHistoryListProps> = ({ userId, onSelectAssessment }) => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_ENDPOINT}/wellness/dosha/history?userId=${userId}&limit=2`);
      if (!response.ok) throw new Error('Failed to fetch assessment history');
      const data = await response.json();
      setAssessments(data.assessments ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Assessment History</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Assessment History</h2>
        <div className="text-center py-6">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Assessment History</h2>
        <p className="text-gray-500 text-center py-4">No past assessments</p>
      </div>
    );
  }

  const maxScore = 15;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Assessment History</h2>
      <div className="space-y-4">
        {assessments.map((record) => {
          const colors = getDoshaColor(record.primaryDosha);
          return (
            <div
              key={record.assessmentId}
              className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectAssessment?.(record)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectAssessment?.(record); }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${colors.badge}`}>
                  {record.primaryDosha}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-purple-600 font-medium">Edit & Retake →</span>
                  <span className="text-sm text-gray-500">{formatDate(record.createdAt)}</span>
                </div>
              </div>
              <div className="space-y-2">
                {(['vata', 'pitta', 'kapha'] as DoshaType[]).map((dosha) => {
                  const score = dosha === 'vata' ? record.vataScore : dosha === 'pitta' ? record.pittaScore : record.kaphaScore;
                  const barColor = getDoshaColor(dosha).bg;
                  return (
                    <div key={dosha} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-12 capitalize">{dosha}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${(score / maxScore) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-600 w-6 text-right">{score}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentHistoryList;
