import React, { useState, useEffect } from 'react';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

interface DailyWellnessTrackerProps {
  doshaType: string | null;
  cyclePhase: string;
}

interface WellnessData {
  water: { goal: string; type: string; tips: string[] };
  sleep: { bedtime: string; wakeup: string; duration: string; tips: string[] };
  routine: { morning: string[]; evening: string[] };
}

const DailyWellnessTracker: React.FC<DailyWellnessTrackerProps> = ({ doshaType, cyclePhase }) => {
  const [data, setData] = useState<WellnessData | null>(null);
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const waterGoal = 8;

  // Load water count from API on mount
  useEffect(() => {
    const loadWater = async () => {
      try {
        const res = await fetch(`${API_ENDPOINT}/profile/water?userId=demo-user`);
        if (res.ok) {
          const data = await res.json();
          if (data.water && data.water.date === new Date().toISOString().split('T')[0]) {
            setWaterGlasses(data.water.count);
          }
        }
      } catch { /* ignore */ }
    };
    loadWater();
  }, []);

  // Save water count to API
  useEffect(() => {
    if (waterGlasses > 0) {
      fetch(`${API_ENDPOINT}/profile/water?userId=demo-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: waterGlasses }),
      }).catch(() => { /* ignore */ });
    }
    // Show celebration when goal reached
    if (waterGlasses === waterGoal) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  }, [waterGlasses]);

  useEffect(() => {
    if (doshaType && cyclePhase) fetchWellnessData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doshaType, cyclePhase]);

  const fetchWellnessData = async () => {
    setLoading(true);
    try {
      const prompt = `For a ${doshaType} dosha woman in ${cyclePhase} menstrual phase, provide:

NO greeting. Start directly.

WATER:
Goal: [daily water intake in liters]
Type: [water type recommendation for ${doshaType} dosha]
Tip1: [water tip]
Tip2: [water tip]
Tip3: [water tip]

SLEEP:
Bedtime: [recommended bedtime]
Wakeup: [recommended wake time]
Duration: [hours of sleep needed]
Tip1: [sleep tip]
Tip2: [sleep tip]

MORNING ROUTINE (Dinacharya):
1. [morning ritual]
2. [morning ritual]
3. [morning ritual]
4. [morning ritual]
5. [morning ritual]
6. [morning ritual]

EVENING ROUTINE:
1. [evening ritual]
2. [evening ritual]
3. [evening ritual]
4. [evening ritual]
5. [evening ritual]

Use traditional Ayurvedic practices specific to ${doshaType} dosha.`;

      const res = await fetch(`${API_ENDPOINT}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, doshaProfile: doshaType ? { dominantDosha: doshaType } : undefined, cyclePhase }),
      });
      if (!res.ok) throw new Error('Failed');
      const result = await res.json();
      const text = result.reply || '';
      setRawText(text);
      parseResponse(text);
    } catch { setRawText('Could not load wellness data.'); }
    finally { setLoading(false); }
  };

  const parseResponse = (text: string) => {
    const lines = text.split('\n').map(l => l.replace(/\*\*/g, '').trim()).filter(Boolean);
    const water = { goal: '2-3 liters', type: 'Warm water', tips: [] as string[] };
    const sleep = { bedtime: '10:00 PM', wakeup: '6:00 AM', duration: '7-8 hours', tips: [] as string[] };
    const morning: string[] = [];
    const evening: string[] = [];
    let section = '';

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (/^(namaste|hello|hi |dear|welcome)/i.test(line)) continue;
      if (lower.includes('water:') || lower.includes('water intake')) { section = 'water'; continue; }
      if (lower.includes('sleep:') || lower.includes('sleep schedule')) { section = 'sleep'; continue; }
      if (lower.includes('morning routine') || lower.includes('morning ritual') || lower.includes('dinacharya')) { section = 'morning'; continue; }
      if (lower.includes('evening routine') || lower.includes('evening ritual')) { section = 'evening'; continue; }

      const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim();
      if (cleaned.length < 3) continue;

      if (section === 'water') {
        if (lower.includes('goal')) water.goal = cleaned.replace(/^goal[:\s]*/i, '');
        else if (lower.includes('type')) water.type = cleaned.replace(/^type[:\s]*/i, '');
        else if (lower.startsWith('tip') || cleaned.length > 10) water.tips.push(cleaned.replace(/^tip\d?[:\s]*/i, ''));
      } else if (section === 'sleep') {
        if (lower.includes('bedtime')) sleep.bedtime = cleaned.replace(/^bedtime[:\s]*/i, '');
        else if (lower.includes('wakeup') || lower.includes('wake')) sleep.wakeup = cleaned.replace(/^(wakeup|wake\s*up|wake)[:\s]*/i, '');
        else if (lower.includes('duration')) sleep.duration = cleaned.replace(/^duration[:\s]*/i, '');
        else if (lower.startsWith('tip') || cleaned.length > 10) sleep.tips.push(cleaned.replace(/^tip\d?[:\s]*/i, ''));
      } else if (section === 'morning' && morning.length < 8) {
        morning.push(cleaned);
      } else if (section === 'evening' && evening.length < 8) {
        evening.push(cleaned);
      }
    }

    setData({ water, sleep, routine: { morning, evening } });
  };

  const addWater = () => { if (waterGlasses < waterGoal * 2) setWaterGlasses((w: number) => w + 1); };
  const removeWater = () => { if (waterGlasses > 0) setWaterGlasses((w: number) => w - 1); };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative mx-auto mb-4 w-14 h-14">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center text-xl">💧</div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Generating your daily wellness plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Water Intake Tracker */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6 animate-fadeInUp" style={{ opacity: 0, animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">💧</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Water Intake Tracker</h3>
            <p className="text-xs text-gray-500">Daily goal: {data?.water.goal || '2-3 liters'} • {data?.water.type || 'Warm water'}</p>
          </div>
          <span className="ml-auto px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">🤖 AI</span>
        </div>

        {/* Water glasses visual */}
        <div className="flex items-center gap-4 mb-4">
          <button onClick={removeWater} className="w-8 h-8 rounded-full bg-white border-2 border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition-all duration-300">−</button>
          <div className="flex-1 flex flex-wrap gap-2 justify-center">
            {Array.from({ length: waterGoal }, (_, i) => (
              <div key={i} className={`w-8 h-10 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:scale-110 flex items-center justify-center text-sm ${
                i < waterGlasses ? 'bg-gradient-to-t from-blue-400 to-cyan-300 border-blue-400 text-white shadow-md scale-105' : 'bg-white border-gray-200 text-gray-300'
              }`}>
                {i < waterGlasses ? '💧' : '○'}
              </div>
            ))}
          </div>
          <button onClick={addWater} className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm">+</button>
        </div>
        <p className="text-center text-sm text-blue-700 font-medium">{waterGlasses} / {waterGoal} glasses today</p>

        {/* Progress bar */}
        <div className="mt-3 h-2.5 bg-blue-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${(waterGlasses / waterGoal) * 100}%` }}></div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">{Math.round((waterGlasses / waterGoal) * 100)}% of daily goal</p>

        {/* Celebration when goal reached */}
        {showCelebration && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center animate-celebrationBounce">
            <div className="text-4xl mb-2 animate-bounce">🎉</div>
            <p className="text-lg font-bold text-green-700">Goal Reached!</p>
            <p className="text-sm text-green-600">Amazing! You've completed your daily water intake. Stay hydrated! 💧</p>
          </div>
        )}

        {data?.water.tips && data.water.tips.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.water.tips.slice(0, 3).map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-blue-800">
                <span className="text-blue-500 mt-0.5">💡</span><span>{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sleep Schedule */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 animate-fadeInUp" style={{ opacity: 0, animationDelay: '150ms', animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🌙</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Sleep Schedule</h3>
            <p className="text-xs text-gray-500">Ayurvedic sleep recommendations for {doshaType} dosha</p>
          </div>
          <span className="ml-auto px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">🤖 AI</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white/70 rounded-xl p-4 text-center border border-indigo-100 hover:scale-105 hover:shadow-lg transition-all duration-300">
            <span className="text-2xl mb-1 block">🌅</span>
            <p className="text-xs text-gray-500">Wake Up</p>
            <p className="text-lg font-bold text-indigo-700">{data?.sleep.wakeup || '6:00 AM'}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-4 text-center border border-indigo-100 hover:scale-105 hover:shadow-lg transition-all duration-300">
            <span className="text-2xl mb-1 block">😴</span>
            <p className="text-xs text-gray-500">Bedtime</p>
            <p className="text-lg font-bold text-indigo-700">{data?.sleep.bedtime || '10:00 PM'}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-4 text-center border border-indigo-100 hover:scale-105 hover:shadow-lg transition-all duration-300">
            <span className="text-2xl mb-1 block">⏰</span>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-lg font-bold text-indigo-700">{data?.sleep.duration || '7-8 hrs'}</p>
          </div>
        </div>

        {data?.sleep.tips && data.sleep.tips.length > 0 && (
          <div className="space-y-2">
            {data.sleep.tips.slice(0, 3).map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-indigo-800">
                <span className="text-indigo-500 mt-0.5">🌿</span><span>{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Routine - Dinacharya */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6 animate-fadeInUp" style={{ opacity: 0, animationDelay: '300ms', animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🕉️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Dinacharya (Daily Routine)</h3>
            <p className="text-xs text-gray-500">Ayurvedic daily rituals for {doshaType} dosha in {cyclePhase} phase</p>
          </div>
          <span className="ml-auto px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">🤖 AI</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Morning Routine */}
          <div>
            <h4 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-sm">🌅</span>
              Morning Routine
            </h4>
            <div className="space-y-2">
              {(data?.routine.morning || []).map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/60 rounded-xl p-3 border border-amber-100/50 animate-fadeInUp" style={{ opacity: 0, animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}>
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
              {(!data?.routine.morning || data.routine.morning.length === 0) && (
                <p className="text-sm text-gray-400 italic">Loading morning routine...</p>
              )}
            </div>
          </div>

          {/* Evening Routine */}
          <div>
            <h4 className="text-sm font-semibold text-purple-700 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-sm">🌙</span>
              Evening Routine
            </h4>
            <div className="space-y-2">
              {(data?.routine.evening || []).map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/60 rounded-xl p-3 border border-purple-100/50 animate-fadeInUp" style={{ opacity: 0, animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}>
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
              {(!data?.routine.evening || data.routine.evening.length === 0) && (
                <p className="text-sm text-gray-400 italic">Loading evening routine...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Raw fallback */}
      {!data && rawText && !loading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{rawText}</div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes celebrationBounce {
          0% { opacity: 0; transform: scale(0.5); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-celebrationBounce {
          animation: celebrationBounce 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DailyWellnessTracker;
