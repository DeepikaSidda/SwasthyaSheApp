import React, { useState } from 'react';
import { SymptomEntry, SelectedSymptom } from '../../types';

interface SymptomHistoryProps {
  entries: SymptomEntry[];
  onEntryClick?: (entry: SymptomEntry) => void;
  loading?: boolean;
}

const SymptomHistory: React.FC<SymptomHistoryProps> = ({
  entries,
  onEntryClick,
  loading = false,
}) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getEnergyEmoji = (level: string): string => {
    switch (level) {
      case 'low':
        return '😴';
      case 'medium':
        return '😊';
      case 'high':
        return '⚡';
      default:
        return '😊';
    }
  };

  const getSeverityColor = (severity: number): string => {
    if (severity <= 2) return 'bg-green-100 text-green-700';
    if (severity <= 3) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const renderSymptomBadge = (symptom: SelectedSymptom) => (
    <span
      key={symptom.id}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 mb-2 hover:scale-110 transition-transform duration-200 ${getSeverityColor(
        symptom.severity
      )}`}
    >
      {symptom.name}
      <span className="ml-1 opacity-75">({symptom.severity})</span>
    </span>
  );

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Symptom History</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Symptom History</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-600">No symptoms logged yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Start tracking your symptoms to see your history here.
          </p>
        </div>
      </div>
    );
  }

  // Sort entries by date (most recent first) and limit to last 2
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 2);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-sm">
          <span className="text-white text-lg">📊</span>
        </div>
        Symptom History
      </h2>

      <div className="space-y-3">
        {sortedEntries.map((entry, index) => {
          const isExpanded = expandedEntry === entry.SK;
          const physicalSymptoms = entry.symptoms.filter((s) => s.category === 'physical');
          const emotionalSymptoms = entry.symptoms.filter((s) => s.category === 'emotional');

          return (
            <div
              key={entry.SK}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 hover:shadow-md hover:scale-[1.01] transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => {
                  setExpandedEntry(isExpanded ? null : entry.SK);
                  onEntryClick?.(entry);
                }}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getEnergyEmoji(entry.energyLevel)}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{formatDate(entry.date)}</div>
                    <div className="text-sm text-gray-500">
                      {entry.symptoms.length} symptom{entry.symptoms.length !== 1 ? 's' : ''} logged
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.energyLevel === 'low'
                        ? 'bg-red-100 text-red-700'
                        : entry.energyLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {entry.energyLevel.charAt(0).toUpperCase() + entry.energyLevel.slice(1)} Energy
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 py-3 border-t border-gray-200">
                  {physicalSymptoms.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Physical Symptoms</h4>
                      <div className="flex flex-wrap">
                        {physicalSymptoms.map(renderSymptomBadge)}
                      </div>
                    </div>
                  )}

                  {emotionalSymptoms.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Emotional Symptoms</h4>
                      <div className="flex flex-wrap">
                        {emotionalSymptoms.map(renderSymptomBadge)}
                      </div>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Notes</h4>
                      <p className="text-sm text-gray-700">{entry.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SymptomHistory;
