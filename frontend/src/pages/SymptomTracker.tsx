import React, { useState, useEffect, useCallback } from 'react';
import {
  SymptomLogForm,
  AyurvedicRecommendations,
  SymptomHistory,
} from '../components/SymptomTracker';
import AISymptomInsights from '../components/SymptomTracker/AISymptomInsights';
import {
  SymptomEntry,
  SymptomLogInput,
  AyurvedicRecommendation,
  RecommendationType,
} from '../types';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

// Demo mode flag - set to true when API is unavailable
const USE_DEMO_MODE = false;

// Demo data for testing without backend
const generateDemoSymptomData = (): { symptoms: SymptomEntry[]; recommendations: RecommendationsResponse } => {
  const today = new Date();
  
  const symptoms: SymptomEntry[] = [
    {
      PK: 'USER#demo-user',
      SK: `SYMPTOM#${today.toISOString().split('T')[0]}`,
      userId: 'demo-user',
      date: today.toISOString().split('T')[0],
      symptoms: [
        { id: 'cramps', name: 'Menstrual Cramps', severity: 3, category: 'physical' },
        { id: 'fatigue', name: 'Fatigue', severity: 2, category: 'physical' },
      ],
      energyLevel: 'low',
      notes: 'Feeling tired today',
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
    },
    {
      PK: 'USER#demo-user',
      SK: `SYMPTOM#${new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
      userId: 'demo-user',
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      symptoms: [
        { id: 'headache', name: 'Headache', severity: 2, category: 'physical' },
        { id: 'bloating', name: 'Bloating', severity: 3, category: 'physical' },
      ],
      energyLevel: 'medium',
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      PK: 'USER#demo-user',
      SK: `SYMPTOM#${new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
      userId: 'demo-user',
      date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      symptoms: [
        { id: 'mood_swings', name: 'Mood Swings', severity: 4, category: 'emotional' },
      ],
      energyLevel: 'low',
      createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const recommendations: RecommendationsResponse = {
    recommendations: [
      {
        id: 'ginger-tea',
        symptomIds: ['cramps', 'nausea'],
        type: 'herbal',
        title: 'Ginger Tea',
        titleKey: 'recommendations.gingerTea.title',
        description: 'Ginger helps reduce menstrual cramps and nausea. Drink 2-3 cups daily.',
        descriptionKey: 'recommendations.gingerTea.description',
        instructions: 'Boil sliced ginger in water for 10 minutes. Add honey and lemon to taste.',
      },
      {
        id: 'warm-foods',
        symptomIds: ['bloating', 'fatigue'],
        type: 'dietary',
        title: 'Warm, Nourishing Foods',
        titleKey: 'recommendations.warmFoods.title',
        description: 'Eat warm, cooked foods to support digestion and reduce bloating.',
        descriptionKey: 'recommendations.warmFoods.description',
      },
      {
        id: 'childs-pose',
        symptomIds: ['cramps', 'back_pain'],
        type: 'yoga',
        title: "Child's Pose (Balasana)",
        titleKey: 'recommendations.childsPose.title',
        description: 'This gentle pose helps relieve lower back pain and menstrual cramps.',
        descriptionKey: 'recommendations.childsPose.description',
        instructions: 'Kneel on the floor, sit back on your heels, and fold forward with arms extended.',
      },
      {
        id: 'rest',
        symptomIds: ['fatigue', 'mood_swings'],
        type: 'lifestyle',
        title: 'Prioritize Rest',
        titleKey: 'recommendations.rest.title',
        description: 'Get adequate sleep and take short breaks throughout the day.',
        descriptionKey: 'recommendations.rest.description',
      },
    ],
    byType: {
      herbal: [{
        id: 'ginger-tea',
        symptomIds: ['cramps', 'nausea'],
        type: 'herbal',
        title: 'Ginger Tea',
        titleKey: 'recommendations.gingerTea.title',
        description: 'Ginger helps reduce menstrual cramps and nausea.',
        descriptionKey: 'recommendations.gingerTea.description',
      }],
      dietary: [{
        id: 'warm-foods',
        symptomIds: ['bloating', 'fatigue'],
        type: 'dietary',
        title: 'Warm, Nourishing Foods',
        titleKey: 'recommendations.warmFoods.title',
        description: 'Eat warm, cooked foods to support digestion.',
        descriptionKey: 'recommendations.warmFoods.description',
      }],
      yoga: [{
        id: 'childs-pose',
        symptomIds: ['cramps', 'back_pain'],
        type: 'yoga',
        title: "Child's Pose (Balasana)",
        titleKey: 'recommendations.childsPose.title',
        description: 'Gentle pose for cramp relief.',
        descriptionKey: 'recommendations.childsPose.description',
      }],
      lifestyle: [{
        id: 'rest',
        symptomIds: ['fatigue', 'mood_swings'],
        type: 'lifestyle',
        title: 'Prioritize Rest',
        titleKey: 'recommendations.rest.title',
        description: 'Get adequate sleep and rest.',
        descriptionKey: 'recommendations.rest.description',
      }],
    },
    disclaimer: 'These Ayurvedic recommendations are for informational purposes only. Consult a healthcare provider for medical advice.',
  };

  return { symptoms, recommendations };
};

interface RecommendationsResponse {
  recommendations: AyurvedicRecommendation[];
  byType: Record<RecommendationType, AyurvedicRecommendation[]>;
  disclaimer: string;
  basedOn?: {
    date: string;
    symptoms: { id: string; name: string; severity: number }[];
  };
}

const SymptomTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [symptomHistory, setSymptomHistory] = useState<SymptomEntry[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [aiTipsLoading, setAiTipsLoading] = useState(false);

  // Mock userId - in production, this would come from auth context
  const userId = 'demo-user';

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [loading]);

  const fetchSymptomHistory = useCallback(async () => {
    try {
      // Use demo mode if enabled
      if (USE_DEMO_MODE) {
        const demoData = generateDemoSymptomData();
        setSymptomHistory(demoData.symptoms);
        return;
      }
      
      const response = await fetch(`${API_ENDPOINT}/symptoms?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch symptom history');
      }
      const data = await response.json();
      setSymptomHistory(data.symptoms || []);
    } catch (err) {
      console.error('Error fetching symptoms:', err);
      // Fallback to demo data
      const demoData = generateDemoSymptomData();
      setSymptomHistory(demoData.symptoms);
    }
  }, [userId]);

  const fetchRecommendations = useCallback(async () => {
    setRecommendationsLoading(true);
    try {
      // Use demo mode if enabled
      if (USE_DEMO_MODE) {
        const demoData = generateDemoSymptomData();
        setRecommendations(demoData.recommendations);
        setRecommendationsLoading(false);
        return;
      }
      
      const response = await fetch(`${API_ENDPOINT}/symptoms/recommendations?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      // Fallback to demo data
      const demoData = generateDemoSymptomData();
      setRecommendations(demoData.recommendations);
    } finally {
      setRecommendationsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSymptomHistory(), fetchRecommendations()]);
      setLoading(false);
    };
    loadData();
  }, [fetchSymptomHistory, fetchRecommendations]);

  const handleLogSymptoms = async (entry: SymptomLogInput) => {
    try {
      // Demo mode - add to local state
      if (USE_DEMO_MODE) {
        const newEntry: SymptomEntry = {
          PK: `USER#${userId}`,
          SK: `SYMPTOM#${entry.date}`,
          userId: userId,
          date: entry.date,
          symptoms: entry.symptoms,
          energyLevel: entry.energyLevel,
          notes: entry.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setSymptomHistory(prev => [newEntry, ...prev]);
        return;
      }
      
      const response = await fetch(`${API_ENDPOINT}/symptoms?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to log symptoms');
      }

      // Refresh data after successful submission
      await Promise.all([fetchSymptomHistory(), fetchRecommendations()]);
    } catch (err) {
      throw err;
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Fetch AI-generated tips based on logged symptoms
  const fetchAiTips = useCallback(async () => {
    if (symptomHistory.length === 0) return;
    setAiTipsLoading(true);
    try {
      const recentSymptoms = symptomHistory.slice(0, 3).flatMap(e => e.symptoms.map(s => s.name));
      const uniqueSymptoms = Array.from(new Set(recentSymptoms)).join(', ');
      const prompt = `Based on these symptoms: ${uniqueSymptoms}, give me 3 personalized Ayurvedic wellness tips. NO greeting. Each tip should have a short title and 1-2 sentence description. Format: Title: Description`;
      const res = await fetch(`${API_ENDPOINT}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const text = data.reply || '';
      const tips = text.split('\n').filter((l: string) => l.trim().length > 10).map((l: string) => l.replace(/^[-*•\d.)\s]+/, '').replace(/\*\*/g, '').trim()).filter((l: string) => l.length > 10).slice(0, 6);
      if (tips.length > 0) setAiTips(tips);
    } catch { /* ignore */ }
    finally { setAiTipsLoading(false); }
  }, [symptomHistory]);

  useEffect(() => {
    if (symptomHistory.length > 0 && aiTips.length === 0) fetchAiTips();
  }, [symptomHistory, aiTips.length, fetchAiTips]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🌿</span>
              </div>
            </div>
            <p className="text-gray-600 animate-pulse">Loading your symptom data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundImage: 'url("/images/home-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh' }} className="relative">
    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/40" />
    <div className={`relative max-w-7xl mx-auto pb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className={`mb-8 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
          Symptom Tracker
        </h1>
        <p className="text-gray-600">
          Log your daily symptoms and receive personalized Ayurvedic recommendations.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between animate-shake">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              fetchSymptomHistory();
            }}
            className="text-red-600 hover:text-red-800 text-sm font-medium hover:scale-105 transition-transform"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Left Column - Log Form */}
        <div className="lg:col-span-1 transform transition-all duration-300 hover:scale-[1.01]">
          <SymptomLogForm
            onSubmit={handleLogSymptoms}
            date={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>

        {/* Right Column - Recommendations and History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Ayurvedic Recommendations */}
          <div className="transform transition-all duration-300 hover:scale-[1.005]">
            <AyurvedicRecommendations
              recommendations={recommendations?.recommendations || []}
              byType={recommendations?.byType || { herbal: [], dietary: [], yoga: [], lifestyle: [] }}
              disclaimer={
                recommendations?.disclaimer ||
                'These Ayurvedic recommendations are for informational purposes only and should not be considered medical advice.'
              }
              loading={recommendationsLoading}
            />
          </div>

          {/* Symptom History */}
          <div className="transform transition-all duration-300 hover:scale-[1.005]">
            <SymptomHistory entries={symptomHistory} loading={loading} />
          </div>

          {/* AI Symptom Insights */}
          <div className="transform transition-all duration-300 hover:scale-[1.005]">
            <AISymptomInsights symptomHistory={symptomHistory} />
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className={`mt-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">🌿 Ayurvedic Wellness Tips
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">✨ AI Personalized</span>
          </h2>
          {aiTips.length > 0 && (
            <button onClick={fetchAiTips} disabled={aiTipsLoading} className="text-xs text-green-600 hover:text-green-800 transition-colors">
              {aiTipsLoading ? '⏳ Refreshing...' : '🔄 Refresh Tips'}
            </button>
          )}
        </div>
        {aiTipsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-200 border-t-green-600 mr-3"></div>
            <span className="text-sm text-gray-600 animate-pulse">Generating personalized tips...</span>
          </div>
        ) : aiTips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiTips.slice(0, 3).map((tip, i) => (
              <div key={i} className="bg-white/70 rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-white/90">
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/70 rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-white/90">
              <h3 className="font-medium text-gray-800 mb-2">📝 Track Daily</h3>
              <p className="text-sm text-gray-600">Log your symptoms to get personalized AI-powered Ayurvedic tips.</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-white/90">
              <h3 className="font-medium text-gray-800 mb-2">🌿 Listen to Your Body</h3>
              <p className="text-sm text-gray-600">Ayurveda emphasizes understanding your unique constitution and needs.</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-white/90">
              <h3 className="font-medium text-gray-800 mb-2">🧘 Holistic Approach</h3>
              <p className="text-sm text-gray-600">Combine herbal remedies with yoga, diet, and lifestyle changes for best results.</p>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
    </div>
  );
};

export default SymptomTracker;
