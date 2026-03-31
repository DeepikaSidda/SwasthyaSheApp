import React, { useState, useEffect, useCallback } from 'react';
import {
  DoshaAssessment,
  WeeklyMealPlan,
  WellnessActivities,
  AyurvedicRecipeGenerator,
  DailyWellnessTracker,
  AssessmentHistoryList,
} from '../components/WellnessPlanner';
import WeeklyWellnessSummary from '../components/WellnessPlanner/WeeklyWellnessSummary';
import {
  DoshaProfile,
  WellnessPlan,
  CyclePhase,
  DoshaQuestion,
  DoshaAssessmentAnswer,
  DoshaType,
} from '../types';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

// Demo mode flag - set to true when API is unavailable
const USE_DEMO_MODE = false;

// Demo data for testing without backend
const generateDemoQuestions = (): DoshaQuestion[] => [
  {
    id: 'q1', question: 'How would you describe your body frame?', questionKey: 'dosha.q1', category: 'physical',
    options: [
      { text: 'Thin, light, and lean', textKey: 'dosha.q1.vata', doshaType: 'vata', score: 1 },
      { text: 'Medium build, muscular', textKey: 'dosha.q1.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Larger frame, tends to gain weight easily', textKey: 'dosha.q1.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q2', question: 'How is your skin typically?', questionKey: 'dosha.q2', category: 'physical',
    options: [
      { text: 'Dry, rough, or thin', textKey: 'dosha.q2.vata', doshaType: 'vata', score: 1 },
      { text: 'Warm, oily, or prone to redness', textKey: 'dosha.q2.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Thick, smooth, and moist', textKey: 'dosha.q2.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q3', question: 'How is your hair texture?', questionKey: 'dosha.q3', category: 'physical',
    options: [
      { text: 'Dry, frizzy, or thin', textKey: 'dosha.q3.vata', doshaType: 'vata', score: 1 },
      { text: 'Fine, straight, prone to early graying', textKey: 'dosha.q3.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Thick, wavy, and lustrous', textKey: 'dosha.q3.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q4', question: 'How would you describe your appetite?', questionKey: 'dosha.q4', category: 'digestion',
    options: [
      { text: 'Variable, sometimes forget to eat', textKey: 'dosha.q4.vata', doshaType: 'vata', score: 1 },
      { text: 'Strong, get irritable if meals are missed', textKey: 'dosha.q4.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Steady, can skip meals without discomfort', textKey: 'dosha.q4.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q5', question: 'How is your digestion?', questionKey: 'dosha.q5', category: 'digestion',
    options: [
      { text: 'Irregular, prone to gas and bloating', textKey: 'dosha.q5.vata', doshaType: 'vata', score: 1 },
      { text: 'Strong, sometimes acid reflux or heartburn', textKey: 'dosha.q5.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Slow but steady, feel heavy after meals', textKey: 'dosha.q5.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q6', question: 'How do you handle stress?', questionKey: 'dosha.q6', category: 'mental',
    options: [
      { text: 'Become anxious or worried', textKey: 'dosha.q6.vata', doshaType: 'vata', score: 1 },
      { text: 'Become irritable or angry', textKey: 'dosha.q6.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Withdraw or become stubborn', textKey: 'dosha.q6.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q7', question: 'How is your sleep pattern?', questionKey: 'dosha.q7', category: 'lifestyle',
    options: [
      { text: 'Light sleeper, wake up easily, insomnia', textKey: 'dosha.q7.vata', doshaType: 'vata', score: 1 },
      { text: 'Moderate, wake up feeling warm', textKey: 'dosha.q7.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Deep and heavy, hard to wake up', textKey: 'dosha.q7.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q8', question: 'What is your energy level throughout the day?', questionKey: 'dosha.q8', category: 'lifestyle',
    options: [
      { text: 'Bursts of energy, then fatigue', textKey: 'dosha.q8.vata', doshaType: 'vata', score: 1 },
      { text: 'High energy, focused, driven', textKey: 'dosha.q8.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Steady but slow to start', textKey: 'dosha.q8.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q9', question: 'How do you make decisions?', questionKey: 'dosha.q9', category: 'mental',
    options: [
      { text: 'Quickly but change my mind often', textKey: 'dosha.q9.vata', doshaType: 'vata', score: 1 },
      { text: 'Decisively and with confidence', textKey: 'dosha.q9.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Slowly and carefully, rarely change', textKey: 'dosha.q9.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q10', question: 'What is your body temperature preference?', questionKey: 'dosha.q10', category: 'physical',
    options: [
      { text: 'Prefer warmth, hands and feet often cold', textKey: 'dosha.q10.vata', doshaType: 'vata', score: 1 },
      { text: 'Prefer cool, feel warm easily', textKey: 'dosha.q10.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Adaptable, tolerate most temperatures', textKey: 'dosha.q10.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q11', question: 'How is your memory?', questionKey: 'dosha.q11', category: 'mental',
    options: [
      { text: 'Quick to learn, quick to forget', textKey: 'dosha.q11.vata', doshaType: 'vata', score: 1 },
      { text: 'Sharp and focused memory', textKey: 'dosha.q11.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Slow to learn, but never forget', textKey: 'dosha.q11.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q12', question: 'What is your walking pace?', questionKey: 'dosha.q12', category: 'physical',
    options: [
      { text: 'Fast and light', textKey: 'dosha.q12.vata', doshaType: 'vata', score: 1 },
      { text: 'Determined and purposeful', textKey: 'dosha.q12.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Slow and steady', textKey: 'dosha.q12.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q13', question: 'How are your menstrual cycles typically?', questionKey: 'dosha.q13', category: 'womens_health',
    options: [
      { text: 'Irregular, scanty flow, with cramps', textKey: 'dosha.q13.vata', doshaType: 'vata', score: 1 },
      { text: 'Regular, heavy flow, with heat/irritability', textKey: 'dosha.q13.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Regular, moderate flow, with water retention', textKey: 'dosha.q13.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q14', question: 'How do you feel emotionally before your period?', questionKey: 'dosha.q14', category: 'womens_health',
    options: [
      { text: 'Anxious, restless, or fearful', textKey: 'dosha.q14.vata', doshaType: 'vata', score: 1 },
      { text: 'Irritable, frustrated, or angry', textKey: 'dosha.q14.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Emotional, clingy, or lethargic', textKey: 'dosha.q14.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
  {
    id: 'q15', question: 'How does your body respond to exercise?', questionKey: 'dosha.q15', category: 'lifestyle',
    options: [
      { text: 'Get tired quickly, prefer gentle movement', textKey: 'dosha.q15.vata', doshaType: 'vata', score: 1 },
      { text: 'Enjoy competitive, intense workouts', textKey: 'dosha.q15.pitta', doshaType: 'pitta', score: 1 },
      { text: 'Good stamina but slow to start', textKey: 'dosha.q15.kapha', doshaType: 'kapha', score: 1 },
    ],
  },
];

interface DoshaResponse {
  doshaProfile: DoshaProfile | null;
  questions: DoshaQuestion[];
  message?: string;
}

interface WellnessPlanResponse {
  plan: WellnessPlan;
  doshaProfile?: DoshaProfile;
  message?: string;
}

const CYCLE_PHASES: { value: CyclePhase; label: string; description: string; subtitle: string }[] = [
  { value: 'menstrual', label: 'Menstrual', description: 'Days 1-5', subtitle: 'Period Days' },
  { value: 'follicular', label: 'Follicular', description: 'Days 6-13', subtitle: 'Energy Building' },
  { value: 'ovulatory', label: 'Ovulatory', description: 'Days 14-17', subtitle: 'Peak Energy' },
  { value: 'luteal', label: 'Luteal', description: 'Days 18-28', subtitle: 'Wind Down' },
];

const WellnessPlanner: React.FC = () => {
  const [doshaProfile, setDoshaProfile] = useState<DoshaProfile | null>(null);
  const [questions, setQuestions] = useState<DoshaQuestion[]>([]);
  const [wellnessPlan, setWellnessPlan] = useState<WellnessPlan | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>('follicular');
  const [activeTab, setActiveTab] = useState<'meals' | 'activities' | 'tips' | 'recipes' | 'daily' | 'weekly'>('meals');
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [initialAnswers, setInitialAnswers] = useState<Record<string, DoshaType> | undefined>(undefined);

  const userId = 'demo-user';

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [loading]);

  const fetchDoshaProfile = useCallback(async () => {
    try {
      // Use demo mode if enabled
      if (USE_DEMO_MODE) {
        // Return null to show assessment first time
        setQuestions(generateDemoQuestions());
        return null;
      }
      
      const response = await fetch(`${API_ENDPOINT}/wellness/dosha?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dosha profile');
      }
      const data: DoshaResponse = await response.json();
      setDoshaProfile(data.doshaProfile);
      setQuestions(data.questions || []);
      return data.doshaProfile;
    } catch (err) {
      console.error('Error fetching dosha profile:', err);
      setQuestions(generateDemoQuestions());
      return null;
    }
  }, [userId]);

  // Generate AI-powered wellness plan using Bedrock via /ai-chat endpoint
  const fetchAIWellnessPlan = useCallback(async (phase: CyclePhase, dosha: string): Promise<WellnessPlan | null> => {
    try {
      // Add randomness to get different meals each time
      const themes = ['regional Indian cuisines', 'seasonal ingredients', 'traditional grandmother recipes', 'temple prasadam style', 'South Indian specialties', 'North Indian home cooking', 'Rajasthani thali style', 'Bengali comfort food', 'Kerala Ayurvedic cuisine', 'Gujarati thali'];
      const theme = themes[Math.floor(Math.random() * themes.length)];
      const seed = Date.now().toString(36).slice(-4);

      const prompt = `[Variation: ${seed}] For a ${dosha} dosha woman in ${phase} menstrual phase, create a UNIQUE 7-day Ayurvedic Indian vegetarian meal plan inspired by ${theme}.

NO greeting. NO introduction. Start DIRECTLY with Monday.
IMPORTANT: Do NOT repeat dishes from previous plans. Be creative with different dishes each time.

Use EXACTLY this pipe-separated format for EACH day (one line per day):
Monday|[breakfast dish]|[lunch dish]|[dinner dish]|[snack 1]|[snack 2 or tea]
Tuesday|[breakfast dish]|[lunch dish]|[dinner dish]|[snack 1]|[snack 2 or tea]

Each line: Day|Breakfast|Lunch|Dinner|Snack1|Snack2
Use traditional Indian dishes with Ayurvedic spices (haldi, jeera, hing, ajwain, methi, etc.)
Make dishes specific to ${dosha} dosha balancing in ${phase} phase.
Theme: ${theme} — use dishes from this style.
Give all 7 days Monday through Sunday.`;

      const response = await fetch(`${API_ENDPOINT}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          doshaProfile: { dominantDosha: dosha },
          cyclePhase: phase,
        }),
      });

      if (!response.ok) throw new Error('AI request failed');
      
      const data = await response.json();
      const aiText = data.reply || '';

      return parseAIMealPlan(aiText, dosha as DoshaType, phase);
    } catch (err) {
      console.warn('AI wellness plan failed:', err);
      return null;
    }
  }, []);

  const parseAIMealPlan = (text: string, dosha: DoshaType, phase: CyclePhase): WellnessPlan | null => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const lines = text.split('\n').filter(l => l.trim());
    const mealDays: { day: string; breakfast: string; lunch: string; dinner: string; snack1: string; snack2: string }[] = [];

    for (const line of lines) {
      const trimmed = line.replace(/\*\*/g, '').trim();
      if (/^(namaste|hello|hi |dear|welcome|here|sure|i'd)/i.test(trimmed)) continue;
      
      // Try pipe-delimited: Day|Breakfast|Lunch|Dinner|Snack1|Snack2
      const parts = trimmed.split('|').map(p => p.trim());
      if (parts.length >= 4) {
        const dayName = dayNames.find(d => parts[0].toLowerCase().includes(d.toLowerCase()));
        if (dayName) {
          mealDays.push({
            day: dayName,
            breakfast: parts[1] || 'Warm porridge with spices',
            lunch: parts[2] || 'Dal with jeera rice',
            dinner: parts[3] || 'Light vegetable soup',
            snack1: parts[4] || 'Fresh seasonal fruits',
            snack2: parts[5] || 'Herbal tea',
          });
          continue;
        }
      }

      // Also try: "Monday: Breakfast: X | Lunch: Y | Dinner: Z"
      const dayMatch = dayNames.find(d => trimmed.toLowerCase().startsWith(d.toLowerCase()));
      if (dayMatch) {
        const rest = trimmed.substring(dayMatch.length).replace(/^[:\s-]+/, '');
        // Try splitting by | first
        const pipeParts = rest.split('|').map(p => p.trim());
        if (pipeParts.length >= 3) {
          const extractMeal = (s: string) => s.replace(/^(breakfast|lunch|dinner|snack\s*\d?)\s*:\s*/i, '').trim();
          mealDays.push({
            day: dayMatch,
            breakfast: extractMeal(pipeParts[0]) || 'Warm porridge',
            lunch: extractMeal(pipeParts[1]) || 'Dal rice',
            dinner: extractMeal(pipeParts[2]) || 'Light soup',
            snack1: pipeParts[3] ? extractMeal(pipeParts[3]) : 'Fresh fruits',
            snack2: pipeParts[4] ? extractMeal(pipeParts[4]) : 'Herbal tea',
          });
        }
      }
    }

    if (mealDays.length < 3) return null;

    while (mealDays.length < 7) {
      const idx = mealDays.length;
      mealDays.push({ ...mealDays[idx % mealDays.length], day: dayNames[idx] });
    }

    const basePlan: WellnessPlan = {
      doshaType: dosha,
      cyclePhase: phase,
      mealPlan: { days: mealDays.map(d => ({
        day: d.day,
        breakfast: { name: d.breakfast, nameKey: '' },
        lunch: { name: d.lunch, nameKey: '' },
        dinner: { name: d.dinner, nameKey: '' },
        snacks: [{ name: d.snack1, nameKey: '' }, { name: d.snack2, nameKey: '' }],
      })) },
      activities: [
        { type: 'yoga', name: `${dosha.charAt(0).toUpperCase() + dosha.slice(1)}-balancing Yoga`, nameKey: '', duration: '20 min', description: `AI-recommended yoga for ${dosha} dosha in ${phase} phase`, benefits: ['Dosha balance', 'Stress relief', 'Flexibility'] },
        { type: 'meditation', name: 'Guided Pranayama', nameKey: '', duration: '15 min', description: 'Breathing exercises for inner calm', benefits: ['Mental clarity', 'Relaxation'] },
        { type: 'exercise', name: 'Gentle Walking', nameKey: '', duration: '30 min', description: 'Light movement for energy flow', benefits: ['Circulation', 'Energy'] },
      ],
      tips: [`Stay hydrated with warm water for ${dosha} balance`, `Eat your largest meal at lunch`, `Practice gentle exercise during ${phase} phase`, 'Get adequate rest by 10 PM', 'Avoid cold foods and drinks'],
      herbsAndTeas: ['Ginger tea', 'Tulsi tea', 'Ashwagandha', 'Chamomile', 'Fennel'],
      foodsToAvoid: ['Cold drinks', 'Raw salads', 'Heavy fried foods', 'Caffeine', 'Processed foods'],
    };
    
    return basePlan;
  };

  const fetchWellnessPlan = useCallback(async (phase: CyclePhase) => {
    setPlanLoading(true);
    try {
      // Try AI-powered plan first
      if (doshaProfile && API_ENDPOINT) {
        const aiPlan = await fetchAIWellnessPlan(phase, doshaProfile.primaryDosha);
        if (aiPlan) {
          setWellnessPlan(aiPlan);
          setPlanLoading(false);
          return;
        }
      }

      // Try backend API
      if (!USE_DEMO_MODE && API_ENDPOINT) {
        const response = await fetch(
          `${API_ENDPOINT}/wellness/plan?userId=${userId}&cyclePhase=${phase}`
        );
        if (response.ok) {
          const data: WellnessPlanResponse = await response.json();
          setWellnessPlan(data.plan);
          setPlanLoading(false);
          return;
        }
      }
      
      // Fallback - show error state
      if (doshaProfile) {
        setError('Could not generate AI plan. Please try changing the cycle phase.');
      }
    } catch (err) {
      console.error('Error fetching wellness plan:', err);
      if (doshaProfile) {
        setError('Could not generate AI plan. Please try again.');
      }
    } finally {
      setPlanLoading(false);
    }
  }, [userId, doshaProfile, fetchAIWellnessPlan]);


  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      const profile = await fetchDoshaProfile();
      if (!cancelled) {
        if (profile) {
          await fetchWellnessPlan(selectedPhase);
        }
        setLoading(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePhaseChange = async (phase: CyclePhase) => {
    setSelectedPhase(phase);
    await fetchWellnessPlan(phase);
  };

  const handleAssessmentComplete = async (answers: DoshaAssessmentAnswer[]) => {
    try {
      // Calculate dosha scores locally
      const scores = { vata: 0, pitta: 0, kapha: 0 };
      answers.forEach(a => {
        scores[a.doshaType] += a.score;
      });
      
      const sortedDoshas = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const newProfile: DoshaProfile = {
        primaryDosha: sortedDoshas[0][0] as 'vata' | 'pitta' | 'kapha',
        secondaryDosha: sortedDoshas[1][1] > 0 ? sortedDoshas[1][0] as 'vata' | 'pitta' | 'kapha' : undefined,
        vataScore: scores.vata,
        pittaScore: scores.pitta,
        kaphaScore: scores.kapha,
        assessmentDate: new Date().toISOString(),
      };

      // Try to save to API (non-blocking)
      if (!USE_DEMO_MODE && API_ENDPOINT) {
        fetch(`${API_ENDPOINT}/wellness/dosha?userId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        }).catch(err => console.warn('Failed to save assessment to API:', err));
      }

      // Update state immediately
      setDoshaProfile(newProfile);
      setShowAssessment(false);
      // Show loading while AI generates the plan
      setPlanLoading(true);
      setWellnessPlan(null);
      // Call AI to generate personalized plan (not static)
      const aiPlan = await fetchAIWellnessPlan(selectedPhase, newProfile.primaryDosha);
      if (aiPlan) {
        setWellnessPlan(aiPlan);
      } else {
        // AI failed - show error instead of static data
        setError('AI could not generate your plan. Please try changing the cycle phase or retake the assessment.');
      }
      setPlanLoading(false);
    } catch (err) {
      throw err;
    }
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'vata':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pitta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'kapha':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDoshaDescription = (dosha: string) => {
    switch (dosha) {
      case 'vata':
        return 'Air & Space - Creative, energetic, and adaptable';
      case 'pitta':
        return 'Fire & Water - Focused, ambitious, and determined';
      case 'kapha':
        return 'Earth & Water - Calm, nurturing, and stable';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundImage: 'url("/images/home-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🧘</span>
              </div>
            </div>
            <p className="text-gray-600 animate-pulse">Loading your wellness data...</p>
          </div>
        </div>
      </div>
      </div>
    );
  }

  // Show assessment if no dosha profile or user wants to retake
  if (!doshaProfile || showAssessment) {
    return (
      <div style={{ backgroundImage: 'url("/images/home-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Wellness Planner
          </h1>
          <p className="text-gray-600">
            Discover your Ayurvedic constitution and receive personalized wellness recommendations.
          </p>
        </div>
        <DoshaAssessment
          key={initialAnswers ? JSON.stringify(initialAnswers) : 'empty'}
          questions={questions}
          onComplete={handleAssessmentComplete}
          onCancel={doshaProfile ? () => setShowAssessment(false) : undefined}
          initialAnswers={initialAnswers}
        />
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>
      </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundImage: 'url("/images/home-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
    <div className={`max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className={`mb-8 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          Wellness Planner
        </h1>
        <p className="text-gray-600">
          Personalized Ayurvedic recommendations based on your dosha and cycle phase.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between animate-shake">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              fetchDoshaProfile();
            }}
            className="text-red-600 hover:text-red-800 text-sm font-medium hover:scale-105 transition-transform"
          >
            Retry
          </button>
        </div>
      )}

      {/* Dosha Profile Card */}
      <div className={`bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-lg border border-purple-100/50 p-8 mb-8 transition-all duration-500 delay-200 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl shadow-md">🧘</div>
              <h2 className="text-lg font-semibold text-gray-800">Your Dosha Profile</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-2 rounded-xl text-sm font-medium border-2 shadow-sm capitalize transition-all duration-300 hover:scale-105 ${getDoshaColor(doshaProfile.primaryDosha)}`}>
                Primary: {doshaProfile.primaryDosha}
              </span>
              {doshaProfile.secondaryDosha && (
                <span className={`px-4 py-2 rounded-xl text-sm font-medium border-2 shadow-sm capitalize transition-all duration-300 hover:scale-105 ${getDoshaColor(doshaProfile.secondaryDosha)}`}>
                  Secondary: {doshaProfile.secondaryDosha}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {getDoshaDescription(doshaProfile.primaryDosha)}
            </p>
          </div>
          <button
            onClick={async () => {
              // Fetch latest assessment from API for pre-fill
              try {
                const res = await fetch(`${API_ENDPOINT}/wellness/dosha/history?userId=${userId}&limit=1`);
                if (res.ok) {
                  const data = await res.json();
                  const assessments = data.assessments || [];
                  if (assessments.length > 0) {
                    const latest = assessments[0];
                    const prefill: Record<string, DoshaType> = {};
                    (latest.answers || []).forEach((a: any) => { prefill[a.questionId] = a.doshaType; });
                    setInitialAnswers(prefill);
                  } else {
                    setInitialAnswers(undefined);
                  }
                } else {
                  setInitialAnswers(undefined);
                }
              } catch {
                setInitialAnswers(undefined);
              }
              setShowAssessment(true);
            }}
            className="px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105"
          >
            Retake Assessment
          </button>
        </div>

        {/* Dosha Scores */}
        <div className="mt-6 pt-5 border-t border-purple-100/50">
          <p className="text-sm font-medium text-gray-500 mb-3">Dosha Balance</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 font-medium">💨 Vata</span>
                <span className="font-semibold text-blue-700">{doshaProfile.vataScore}</span>
              </div>
              <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(doshaProfile.vataScore / 12) * 100}%`, background: 'linear-gradient(to right, #3b82f6, #6366f1)' }}
                />
              </div>
            </div>
            <div className="bg-red-50/70 rounded-xl p-4 border border-red-100/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 font-medium">🔥 Pitta</span>
                <span className="font-semibold text-red-700">{doshaProfile.pittaScore}</span>
              </div>
              <div className="h-3 bg-red-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(doshaProfile.pittaScore / 12) * 100}%`, background: 'linear-gradient(to right, #ef4444, #f97316)' }}
                />
              </div>
            </div>
            <div className="bg-green-50/70 rounded-xl p-4 border border-green-100/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 font-medium">🌍 Kapha</span>
                <span className="font-semibold text-green-700">{doshaProfile.kaphaScore}</span>
              </div>
              <div className="h-3 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(doshaProfile.kaphaScore / 12) * 100}%`, background: 'linear-gradient(to right, #22c55e, #14b8a6)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cycle Phase Selector */}
      <div className={`bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl shadow-lg border border-indigo-100/50 p-8 mb-8 transition-all duration-500 delay-300 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Select Your Cycle Phase</h2>
        <p className="text-sm text-gray-500 mb-4">Choose your current menstrual cycle phase to get personalized AI recommendations for meals, activities, and daily routines</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CYCLE_PHASES.map((phase, index) => {
            const phaseEmojis: Record<string, string> = { menstrual: '🩸', follicular: '🌱', ovulatory: '🌸', luteal: '🍂' };
            const phaseActiveStyles: Record<string, string> = {
              menstrual: 'border-red-400 bg-red-50 shadow-md ring-1 ring-red-200',
              follicular: 'border-green-400 bg-green-50 shadow-md ring-1 ring-green-200',
              ovulatory: 'border-pink-400 bg-pink-50 shadow-md ring-1 ring-pink-200',
              luteal: 'border-amber-400 bg-amber-50 shadow-md ring-1 ring-amber-200',
            };
            const phaseActiveText: Record<string, string> = {
              menstrual: 'text-red-700',
              follicular: 'text-green-700',
              ovulatory: 'text-pink-700',
              luteal: 'text-amber-700',
            };
            const isActive = selectedPhase === phase.value;
            return (
              <button
                key={phase.value}
                onClick={() => handlePhaseChange(phase.value)}
                disabled={planLoading}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-[1.02] active:scale-[0.98] ${
                  isActive
                    ? phaseActiveStyles[phase.value]
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                } ${planLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="text-2xl mb-2">{phaseEmojis[phase.value]}</div>
                <p className={`font-medium ${isActive ? phaseActiveText[phase.value] : 'text-gray-800'}`}>
                  {phase.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{phase.subtitle}</p>
                <p className="text-xs text-gray-400 mt-0.5">{phase.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Tabs */}
      <div className={`bg-gradient-to-br from-white to-purple-50/20 rounded-2xl shadow-lg border border-purple-100/50 overflow-hidden transition-all duration-500 delay-400 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Tab Navigation */}
        <div className="bg-gray-50/80 px-4 pt-4">
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('meals')}
              className={`flex-1 py-3.5 px-6 text-center font-medium transition-all duration-300 rounded-t-xl ${
                activeTab === 'meals'
                  ? 'bg-white text-purple-700 shadow-sm border border-b-0 border-purple-100/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
              style={activeTab === 'meals' ? { borderBottom: '3px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #a855f7, #6366f1)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderBottomColor: 'transparent', boxShadow: '0 2px 0 -1px white' } : {}}
            >
              🍽️ Meal Plan
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex-1 py-3.5 px-6 text-center font-medium transition-all duration-300 rounded-t-xl ${
                activeTab === 'activities'
                  ? 'bg-white text-purple-700 shadow-sm border border-b-0 border-purple-100/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
              style={activeTab === 'activities' ? { borderBottom: '3px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #a855f7, #6366f1)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderBottomColor: 'transparent', boxShadow: '0 2px 0 -1px white' } : {}}
            >
              🧘 Activities
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex-1 py-3.5 px-6 text-center font-medium transition-all duration-300 rounded-t-xl ${
                activeTab === 'tips'
                  ? 'bg-white text-purple-700 shadow-sm border border-b-0 border-purple-100/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
              style={activeTab === 'tips' ? { borderBottom: '3px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #a855f7, #6366f1)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderBottomColor: 'transparent', boxShadow: '0 2px 0 -1px white' } : {}}
            >
              💡 Tips & More
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex-1 py-3.5 px-6 text-center font-medium transition-all duration-300 rounded-t-xl ${
                activeTab === 'recipes'
                  ? 'bg-white text-purple-700 shadow-sm border border-b-0 border-purple-100/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
              style={activeTab === 'recipes' ? { borderBottom: '3px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #f97316, #ef4444)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderBottomColor: 'transparent', boxShadow: '0 2px 0 -1px white' } : {}}
            >
              🍳 AI Recipes
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-3.5 px-6 text-center font-medium transition-all duration-300 rounded-t-xl ${
                activeTab === 'daily'
                  ? 'bg-white text-purple-700 shadow-sm border border-b-0 border-purple-100/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
              style={activeTab === 'daily' ? { borderBottom: '3px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #3b82f6, #06b6d4)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderBottomColor: 'transparent', boxShadow: '0 2px 0 -1px white' } : {}}
            >
              💧 Daily Wellness
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 py-3.5 px-6 text-center font-medium transition-all duration-300 rounded-t-xl ${
                activeTab === 'weekly'
                  ? 'bg-white text-purple-700 shadow-sm border border-b-0 border-purple-100/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
              style={activeTab === 'weekly' ? { borderBottom: '3px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #8b5cf6, #a855f7)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', borderBottomColor: 'transparent', boxShadow: '0 2px 0 -1px white' } : {}}
            >
              📋 Weekly Summary
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {planLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="relative mx-auto mb-4 w-14 h-14">
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                  <div className="absolute inset-2 animate-spin rounded-full border-4 border-indigo-200 border-b-indigo-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center text-lg">🧘</div>
                </div>
                <p className="text-gray-600 font-medium animate-pulse">Loading your personalized plan...</p>
              </div>
            </div>
          ) : wellnessPlan ? (
            <div className="animate-fadeIn">
              {activeTab === 'meals' && (
                <WeeklyMealPlan
                  mealPlan={wellnessPlan.mealPlan}
                  cyclePhase={wellnessPlan.cyclePhase}
                  doshaType={wellnessPlan.doshaType}
                />
              )}
              {activeTab === 'activities' && (
                <WellnessActivities
                  activities={wellnessPlan.activities}
                  cyclePhase={wellnessPlan.cyclePhase}
                />
              )}
              {activeTab === 'tips' && (
                <div className="space-y-6">
                  {/* Tips */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      Wellness Tips for {selectedPhase.charAt(0).toUpperCase() + selectedPhase.slice(1)} Phase
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">✨ AI Powered</span>
                    </h3>
                    <div className="grid gap-3">
                      {wellnessPlan.tips.map((tip, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span className="text-purple-500 mt-0.5">✨</span>
                          <p className="text-gray-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Herbs and Teas */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🍵 Recommended Herbs & Teas</h3>
                    <div className="flex flex-wrap gap-2">
                      {wellnessPlan.herbsAndTeas.map((item, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm border border-green-200 transform transition-all duration-300 hover:scale-110 hover:shadow-md cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Foods to Avoid */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🚫 Foods to Avoid</h3>
                    <div className="flex flex-wrap gap-2">
                      {wellnessPlan.foodsToAvoid.map((item, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm border border-red-200 transform transition-all duration-300 hover:scale-110 hover:shadow-md cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'recipes' && (
                <AyurvedicRecipeGenerator
                  doshaType={doshaProfile?.primaryDosha || null}
                  cyclePhase={selectedPhase}
                />
              )}
              {activeTab === 'daily' && (
                <DailyWellnessTracker
                  doshaType={doshaProfile?.primaryDosha || null}
                  cyclePhase={selectedPhase}
                />
              )}
              {activeTab === 'weekly' && (
                <WeeklyWellnessSummary
                  doshaType={doshaProfile?.primaryDosha || null}
                  cyclePhase={selectedPhase}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No wellness plan available. Please try again.</p>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className={`mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-amber-800">
            These Ayurvedic recommendations are for informational purposes only and should not be considered medical advice. 
            Please consult with a healthcare professional before making significant changes to your diet or lifestyle.
          </p>
        </div>
      </div>

      {/* Assessment History */}
      <AssessmentHistoryList
        userId={userId}
        onSelectAssessment={(assessment) => {
          const prefill: Record<string, DoshaType> = {};
          (assessment.answers || []).forEach((a) => { prefill[a.questionId] = a.doshaType; });
          setInitialAnswers(prefill);
          setShowAssessment(true);
        }}
      />

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
    </div>
  );
};

export default WellnessPlanner;
