import React, { useState, useEffect, useCallback } from 'react';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

interface WeeklyWellnessSummaryProps {
  doshaType: string | null;
  cyclePhase: string;
}

const WeeklyWellnessSummary: React.FC<WeeklyWellnessSummaryProps> = ({ doshaType, cyclePhase }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [cycleInfo, setCycleInfo] = useState('');
  const [symptomInfo, setSymptomInfo] = useState('');

  const userId = 'demo-user';

  const fetchData = useCallback(async () => {
    // Fetch cycle and symptom data in parallel
    const [cycleRes, symptomRes] = await Promise.allSettled([
      fetch(`${API_ENDPOINT}/cycles?userId=${userId}`),
      fetch(`${API_ENDPOINT}/symptoms?userId=${userId}`),
    ]);

    let cycleText = 'No cycle data available';
    if (cycleRes.status === 'fulfilled' && cycleRes.value.ok) {
      const data = await cycleRes.value.json();
      const cycles = data.items || [];
      if (cycles.length > 0) {
        const recent = cycles.slice(0, 3);
        cycleText = recent.map((c: any) => `Period: ${c.startDate}${c.endDate ? ' to ' + c.endDate : ''}, Flow: ${c.flowIntensity || 'unknown'}`).join('; ');
      }
    }

    let symptomText = 'No symptoms logged';
    if (symptomRes.status === 'fulfilled' && symptomRes.value.ok) {
      const data = await symptomRes.value.json();
      const symptoms = data.symptoms || [];
      if (symptoms.length > 0) {
        const recent = symptoms.slice(0, 5);
        const allSymptoms = recent.flatMap((e: any) => e.symptoms?.map((s: any) => `${s.name} (severity ${s.severity})`) || []);
        const energyLevels = recent.map((e: any) => e.energyLevel).filter(Boolean);
        symptomText = `Symptoms: ${Array.from(new Set(allSymptoms)).join(', ')}. Energy levels: ${energyLevels.join(', ')}`;
      }
    }

    setCycleInfo(cycleText);
    setSymptomInfo(symptomText);
    return { cycleText, symptomText };
  }, []);

  const generateSummary = useCallback(async () => {
    setLoading(true);
    setSummary('');
    try {
      const { cycleText, symptomText } = await fetchData();

      const prompt = `You are an Ayurvedic wellness advisor. Generate a personalized WEEKLY WELLNESS SUMMARY for a woman with the following data:

Dosha Type: ${doshaType || 'Unknown (not assessed yet)'}
Current Cycle Phase: ${cyclePhase}
Recent Cycle Data: ${cycleText}
Recent Symptoms: ${symptomText}

NO greeting. NO introduction. Start DIRECTLY with the summary.

Provide these sections with clear headers:
📊 WEEK AT A GLANCE - Brief 2-line overview of her wellness state this week
🌿 DOSHA BALANCE - How her current symptoms relate to dosha imbalance, what to watch for
🩸 CYCLE INSIGHTS - Where she is in her cycle and what that means for her body
⚡ ENERGY & MOOD - Analysis of energy patterns and emotional wellness
🍽️ NUTRITION FOCUS - Top 3 foods to prioritize this week based on all data
🧘 MOVEMENT & REST - Exercise and rest recommendations for this specific week
💊 HERBAL SUPPORT - 2-3 specific herbs/teas for this week
🎯 WEEKLY GOALS - 3 actionable goals for the coming week

Keep each section concise (2-3 lines max). Use bullet points. Be specific to her data.`;

      const res = await fetch(`${API_ENDPOINT}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      if (!res.ok) throw new Error('Failed to generate summary');
      const data = await res.json();
      setSummary(data.reply || 'Could not generate summary. Please try again.');
    } catch {
      setSummary('Could not generate your weekly summary. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [doshaType, cyclePhase, fetchData]);

  useEffect(() => {
    if (doshaType && !summary) generateSummary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doshaType]);

  const weekDates = () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(start)} – ${fmt(end)}, ${now.getFullYear()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            📋 Weekly Wellness Summary
            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">🤖 AI Generated</span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">{weekDates()}</p>
        </div>
        <button
          onClick={generateSummary}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 transition-all disabled:opacity-50"
        >
          {loading ? '⏳ Generating...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
          <div className="text-2xl mb-1">🧬</div>
          <div className="text-xs text-gray-500">Dosha</div>
          <div className="font-semibold text-gray-800 capitalize">{doshaType || 'Not assessed'}</div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
          <div className="text-2xl mb-1">🌙</div>
          <div className="text-xs text-gray-500">Cycle Phase</div>
          <div className="font-semibold text-gray-800 capitalize">{cyclePhase}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 border border-green-100">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-xs text-gray-500">Data Sources</div>
          <div className="font-semibold text-gray-800">
            {(cycleInfo !== 'No cycle data available' ? 1 : 0) + (symptomInfo !== 'No symptoms logged' ? 1 : 0) + (doshaType ? 1 : 0)}/3
          </div>
        </div>
      </div>

      {/* Summary Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="relative mx-auto mb-4 w-12 h-12">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
              <div className="absolute inset-0 flex items-center justify-center text-lg">📋</div>
            </div>
            <p className="text-sm text-gray-600 animate-pulse">Analyzing your wellness data...</p>
            <p className="text-xs text-gray-400 mt-1">Combining cycle, symptoms & dosha insights</p>
          </div>
        </div>
      ) : summary ? (
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-gradient-to-br from-purple-50/30 to-indigo-50/30 rounded-xl p-6 border border-purple-100/50 leading-relaxed">
          {summary.replace(/\*\*/g, '')}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl block mb-3">📋</span>
          <p>Complete your dosha assessment to get a personalized weekly summary.</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyWellnessSummary;
