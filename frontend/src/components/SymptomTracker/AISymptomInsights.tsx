import React, { useState, useEffect } from 'react';
import { SymptomEntry } from '../../types';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

interface AISymptomInsightsProps {
  symptomHistory: SymptomEntry[];
}

const AISymptomInsights: React.FC<AISymptomInsightsProps> = ({ symptomHistory }) => {
  const [activeSection, setActiveSection] = useState<'analysis' | 'correlation' | 'remedy'>('analysis');
  const [analysisText, setAnalysisText] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [remedyQuery, setRemedyQuery] = useState('');
  const [remedyResult, setRemedyResult] = useState('');
  const [remedyLoading, setRemedyLoading] = useState(false);

  // Auto-fetch analysis when symptoms exist
  useEffect(() => {
    if (symptomHistory.length > 0 && activeSection === 'analysis' && !analysisText) {
      fetchAnalysis();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symptomHistory, activeSection]);

  const fetchAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const allSymptoms = symptomHistory.flatMap(e => e.symptoms.map(s => `${s.name} (severity ${s.severity})`));
      const energyLevels = symptomHistory.map(e => e.energyLevel);
      const prompt = `Analyze these symptoms logged over recent days: ${allSymptoms.join(', ')}. Energy levels: ${energyLevels.join(', ')}.

NO greeting. Provide:
1. Pattern Analysis: What patterns do you see in these symptoms?
2. Possible Causes: What might be causing these symptoms according to Ayurveda?
3. Dosha Imbalance: Which dosha might be imbalanced?
4. Action Items: 3 specific things to do right now

Use bullet points. Be specific to the symptoms listed.`;

      const res = await fetch(`${API_ENDPOINT}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setAnalysisText(data.reply || 'Could not analyze symptoms.');
    } catch { setAnalysisText('Could not analyze symptoms. Please try again.'); }
    finally { setAnalysisLoading(false); }
  };

  const fetchRemedy = async () => {
    if (!remedyQuery.trim()) return;
    setRemedyLoading(true);
    setRemedyResult('');
    try {
      const prompt = `For the symptom "${remedyQuery}", provide traditional Indian Ayurvedic herbal remedies.

NO greeting. Include:
- 3 herbal remedies with preparation method
- Home remedies using kitchen ingredients
- Yoga poses that help
- Foods to eat and avoid
- When to see a doctor

Use traditional Indian grandmother (Bhamma) style remedies with herbs like tulsi, haldi, ashwagandha, shatavari, brahmi, etc.`;

      const res = await fetch(`${API_ENDPOINT}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setRemedyResult(data.reply || 'Could not find remedies.');
    } catch { setRemedyResult('Could not find remedies. Please try again.'); }
    finally { setRemedyLoading(false); }
  };

  // Build cycle correlation data from symptom history
  const getCycleCorrelation = () => {
    const phases = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
    const phaseSymptoms: Record<string, Record<string, number>> = {};
    phases.forEach(p => { phaseSymptoms[p] = {}; });

    // Map dates to approximate cycle phases (simplified)
    symptomHistory.forEach(entry => {
      const day = new Date(entry.date).getDate();
      let phase = 'follicular';
      if (day <= 5) phase = 'menstrual';
      else if (day <= 13) phase = 'follicular';
      else if (day <= 17) phase = 'ovulatory';
      else phase = 'luteal';

      entry.symptoms.forEach(s => {
        if (!phaseSymptoms[phase][s.name]) phaseSymptoms[phase][s.name] = 0;
        phaseSymptoms[phase][s.name]++;
      });
    });
    return phaseSymptoms;
  };

  const phaseEmojis: Record<string, string> = { menstrual: '🩸', follicular: '🌱', ovulatory: '🌸', luteal: '🍂' };
  const phaseColors: Record<string, string> = { menstrual: 'bg-red-50 border-red-200', follicular: 'bg-green-50 border-green-200', ovulatory: 'bg-pink-50 border-pink-200', luteal: 'bg-amber-50 border-amber-200' };

  const commonRemedySymptoms = ['Menstrual Cramps', 'Headache', 'Bloating', 'Fatigue', 'Back Pain', 'Nausea', 'Insomnia', 'Anxiety', 'Acne', 'Mood Swings'];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'analysis' as const, icon: '🧠', label: 'AI Analysis' },
          { key: 'correlation' as const, icon: '📊', label: 'Cycle Correlation' },
          { key: 'remedy' as const, icon: '🌿', label: 'Herbal Remedy Finder' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveSection(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              activeSection === tab.key
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* AI Symptom Analysis */}
      {activeSection === 'analysis' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center"><span className="text-white">🧠</span></div>
              <h3 className="text-lg font-bold text-gray-900">AI Symptom Analysis</h3>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">🤖 AI</span>
            </div>
            <button onClick={fetchAnalysis} disabled={analysisLoading || symptomHistory.length === 0}
              className="text-xs text-purple-600 hover:text-purple-800 disabled:text-gray-400">🔄 Re-analyze</button>
          </div>
          {symptomHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl block mb-2">📝</span>
              <p>Log some symptoms first to get AI analysis</p>
            </div>
          ) : analysisLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-200 border-t-purple-600 mr-3"></div>
              <span className="text-sm text-gray-600 animate-pulse">Analyzing your symptoms...</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-gradient-to-br from-purple-50/50 to-indigo-50/50 rounded-xl p-5 border border-purple-100">
              {analysisText.replace(/\*\*/g, '')}
            </div>
          )}
        </div>
      )}

      {/* Cycle Correlation */}
      {activeSection === 'correlation' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center"><span className="text-white">📊</span></div>
            <h3 className="text-lg font-bold text-gray-900">Symptom-Cycle Correlation</h3>
          </div>
          {symptomHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl block mb-2">📊</span>
              <p>Log symptoms over multiple days to see cycle correlations</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(getCycleCorrelation()).map(([phase, symptoms]) => (
                <div key={phase} className={`rounded-xl border p-4 ${phaseColors[phase]} transition-all duration-300 hover:shadow-md`}>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 capitalize">
                    <span className="text-xl">{phaseEmojis[phase]}</span>{phase} Phase
                  </h4>
                  {Object.keys(symptoms).length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No symptoms logged in this phase</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(symptoms).map(([name, count]) => (
                        <span key={name} className="px-3 py-1 bg-white/80 rounded-full text-xs font-medium text-gray-700 border border-gray-200 shadow-sm">
                          {name} <span className="text-gray-400">×{count}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-4 text-center">Based on day of month: Days 1-5 = Menstrual, 6-13 = Follicular, 14-17 = Ovulatory, 18-28 = Luteal</p>
        </div>
      )}

      {/* Herbal Remedy Finder */}
      {activeSection === 'remedy' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"><span className="text-white">🌿</span></div>
            <h3 className="text-lg font-bold text-gray-900">Herbal Remedy Finder</h3>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">🤖 AI</span>
          </div>

          {/* Quick symptom buttons */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Quick search:</p>
            <div className="flex flex-wrap gap-2">
              {commonRemedySymptoms.map(s => (
                <button key={s} onClick={() => { setRemedyQuery(s); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    remedyQuery === s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                  }`}>{s}</button>
              ))}
            </div>
          </div>

          {/* Search input */}
          <div className="flex gap-2 mb-4">
            <input type="text" value={remedyQuery} onChange={e => setRemedyQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchRemedy()}
              placeholder="Type a symptom (e.g., menstrual cramps, headache)..."
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-400 outline-none text-sm transition-colors"
            />
            <button onClick={fetchRemedy} disabled={remedyLoading || !remedyQuery.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium text-sm hover:shadow-lg disabled:opacity-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              {remedyLoading ? '⏳' : '🔍'} Find Remedies
            </button>
          </div>

          {/* Results */}
          {remedyLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-200 border-t-green-600 mr-3"></div>
              <span className="text-sm text-gray-600 animate-pulse">Finding traditional remedies...</span>
            </div>
          ) : remedyResult ? (
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-xl p-5 border border-green-100">
              {remedyResult.replace(/\*\*/g, '')}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AISymptomInsights;
