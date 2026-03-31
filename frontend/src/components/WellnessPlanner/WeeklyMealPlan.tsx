import React, { useState } from 'react';
import { MealPlan, CyclePhase, DoshaType, MealSuggestion } from '../../types';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

interface RecipeDetail {
  name: string;
  spices: string[];
  ingredients: string[];
  steps: string[];
  ayurvedicBenefits: string[];
}

interface WeeklyMealPlanProps {
  mealPlan: MealPlan;
  cyclePhase: CyclePhase;
  doshaType: DoshaType | null;
}

const WeeklyMealPlan: React.FC<WeeklyMealPlanProps> = ({
  mealPlan,
  cyclePhase,
  doshaType,
}) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [recipeDetail, setRecipeDetail] = useState<RecipeDetail | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeRaw, setRecipeRaw] = useState('');

  const fetchRecipe = async (dishName: string) => {
    if (expandedRecipe === dishName) {
      setExpandedRecipe(null);
      return;
    }
    setExpandedRecipe(dishName);
    setRecipeLoading(true);
    setRecipeDetail(null);
    setRecipeRaw('');

    try {
      const prompt = `Give me the traditional Indian Ayurvedic recipe for "${dishName}" suitable for ${doshaType || 'balanced'} dosha.

IMPORTANT: No greeting. Start directly.

Include:
SPICES: List the traditional Indian spices used (like haldi, jeera, hing, rai, dhania, garam masala, etc.)
INGREDIENTS: Full ingredient list with quantities
STEPS: Step-by-step cooking instructions (traditional method)
BENEFITS: Ayurvedic health benefits of this dish

Use traditional Indian grandmother-style cooking methods and old-style spice combinations.`;

      const res = await fetch(`${API_ENDPOINT}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, doshaProfile: doshaType ? { dominantDosha: doshaType } : undefined }),
      });

      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const text = data.reply || '';
      setRecipeRaw(text);

      // Parse
      const lines = text.split('\n').filter((l: string) => l.trim());
      const spices: string[] = [];
      const ingredients: string[] = [];
      const steps: string[] = [];
      const benefits: string[] = [];
      let section = '';

      for (const line of lines) {
        const lower = line.toLowerCase();
        const cleaned = line.replace(/^[-*•\d.)\s]+/, '').replace(/\*\*/g, '').trim();
        if (/^(namaste|hello|hi |dear|welcome)/i.test(cleaned)) continue;
        if (lower.includes('spice')) { section = 'sp'; continue; }
        if (lower.includes('ingredient')) { section = 'ing'; continue; }
        if (lower.includes('step') || lower.includes('instruction') || lower.includes('method')) { section = 'st'; continue; }
        if (lower.includes('benefit') || lower.includes('ayurvedic')) { section = 'ben'; continue; }
        if (cleaned.length < 3) continue;
        if (section === 'sp' && spices.length < 12) spices.push(cleaned);
        else if (section === 'ing' && ingredients.length < 15) ingredients.push(cleaned);
        else if (section === 'st' && steps.length < 10) steps.push(cleaned);
        else if (section === 'ben' && benefits.length < 6) benefits.push(cleaned);
      }

      setRecipeDetail({ name: dishName, spices, ingredients, steps, ayurvedicBenefits: benefits });
    } catch {
      setRecipeRaw('Could not load recipe. Try again.');
    } finally {
      setRecipeLoading(false);
    }
  };

  const getDoshaColor = (dosha: DoshaType | null) => {
    switch (dosha) {
      case 'vata':
        return 'text-blue-600';
      case 'pitta':
        return 'text-red-600';
      case 'kapha':
        return 'text-green-600';
      default:
        return 'text-purple-600';
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      case 'snacks':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  const getDayEmoji = (dayName: string) => {
    const lower = dayName.toLowerCase();
    if (lower.includes('mon')) return '🥣';
    if (lower.includes('tue')) return '🍛';
    if (lower.includes('wed')) return '🥘';
    if (lower.includes('thu')) return '🍲';
    if (lower.includes('fri')) return '🥗';
    if (lower.includes('sat')) return '🍜';
    if (lower.includes('sun')) return '🥙';
    return '🍽️';
  };

  const getMealCardStyle = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return {
          card: 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200',
          iconBg: 'bg-gradient-to-br from-amber-100 to-orange-100',
        };
      case 'lunch':
        return {
          card: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
          iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
        };
      case 'dinner':
        return {
          card: 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200',
          iconBg: 'bg-gradient-to-br from-indigo-100 to-purple-100',
        };
      case 'snacks':
        return {
          card: 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200',
          iconBg: 'bg-gradient-to-br from-pink-100 to-rose-100',
        };
      default:
        return {
          card: 'bg-white border-gray-200',
          iconBg: 'bg-gray-100',
        };
    }
  };

  const MealCard: React.FC<{ meal: MealSuggestion; mealType: string }> = ({ meal, mealType }) => {
    const style = getMealCardStyle(mealType);
    const isExpanded = expandedRecipe === `${mealType}-${meal.name}`;
    const recipeKey = `${mealType}-${meal.name}`;
    return (
      <div className={`rounded-xl border ${style.card} p-4 transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'hover:shadow-xl hover:scale-[1.02]'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
            <span className="text-3xl">{getMealIcon(mealType)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800 capitalize">{mealType}</h4>
                <p className={`font-semibold ${getDoshaColor(doshaType)}`}>{meal.name}</p>
              </div>
              <button
                onClick={() => fetchRecipe(recipeKey)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1 bg-white/80 border border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
              >
                {isExpanded ? '✕ Close' : '📜 Recipe'}
              </button>
            </div>
            {meal.description && <p className="text-sm text-gray-600 mt-1">{meal.description}</p>}
            {meal.benefits && meal.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {meal.benefits.map((benefit, index) => (
                  <span key={index} className="px-2 py-0.5 bg-white/70 text-gray-600 rounded-full text-xs">{benefit}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expanded Recipe Section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200/50 transition-all duration-500">
            {recipeLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-200 border-t-purple-600 mr-3"></div>
                <span className="text-sm text-gray-600 animate-pulse">Generating traditional recipe...</span>
              </div>
            ) : recipeDetail && recipeDetail.name === recipeKey ? (
              <div className="space-y-4">
                {recipeDetail.spices.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1">🌶️ Traditional Spices</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {recipeDetail.spices.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs border border-amber-200">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {recipeDetail.ingredients.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">🧂 Ingredients</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {recipeDetail.ingredients.map((ing, i) => (
                        <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">{ing}</span>
                      ))}
                    </div>
                  </div>
                )}
                {recipeDetail.steps.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-indigo-700 mb-2 flex items-center gap-1">👩‍🍳 Cooking Steps</h5>
                    <ol className="space-y-2">
                      {recipeDetail.steps.map((step, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-700">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {recipeDetail.ayurvedicBenefits.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-1">🌿 Ayurvedic Benefits</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {recipeDetail.ayurvedicBenefits.map((b, i) => (
                        <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs border border-purple-200">{b}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : recipeRaw ? (
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{recipeRaw}</div>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  const currentDay = mealPlan.days[selectedDay];

  if (!mealPlan.days || mealPlan.days.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No meal plan available.</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🍽️</span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Weekly Meal Plan
              {doshaType && (
                <span className={`ml-2 text-sm font-normal ${getDoshaColor(doshaType)} capitalize`}>
                  ({doshaType}-balancing)
                </span>
              )}
            </h3>
            <span className="px-2.5 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-xs font-medium">
              ✨ AI Personalized
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 ml-[52px]">
          Personalized meals for your {cyclePhase} phase
        </p>
      </div>

      {/* Day Selector */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-6 -mx-2 px-2">
        {mealPlan.days.map((day, index) => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(index)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all duration-300 min-w-[100px] hover:scale-105 active:scale-95 ${
              selectedDay === index
                ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md'
                : 'border-gray-200 hover:border-purple-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <p className="text-lg mb-0.5">{getDayEmoji(day.day)}</p>
            <p className="font-medium text-sm">{day.day}</p>
            <p className={`text-xs ${selectedDay === index ? 'text-purple-100' : 'opacity-75'}`}>Day {index + 1}</p>
          </button>
        ))}
      </div>

      {/* Selected Day Meals */}
      <div className="space-y-4">
        <MealCard meal={currentDay.breakfast} mealType="breakfast" />
        <MealCard meal={currentDay.lunch} mealType="lunch" />
        <MealCard meal={currentDay.dinner} mealType="dinner" />
        
        {/* Snacks */}
        {currentDay.snacks && currentDay.snacks.length > 0 && (
          <div className={`rounded-xl border ${getMealCardStyle('snacks').card} p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}>
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl ${getMealCardStyle('snacks').iconBg} flex items-center justify-center flex-shrink-0`}>
                <span className="text-3xl">{getMealIcon('snacks')}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-3">Snacks</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentDay.snacks.map((snack, index) => (
                    <div
                      key={index}
                      className="bg-white/60 rounded-xl p-3"
                    >
                      <p className={`font-medium ${getDoshaColor(doshaType)}`}>{snack.name}</p>
                      {snack.benefits && snack.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {snack.benefits.map((benefit, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-gray-500"
                            >
                              {benefit}{idx < snack.benefits!.length - 1 ? ' • ' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meal Timing Tips */}
      <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm">⏰</span>
          </div>
          <h4 className="font-medium text-purple-800">Meal Timing Tips</h4>
        </div>
        <ul className="text-sm text-purple-700 space-y-1.5 ml-12">
          <li>• Breakfast: 7-8 AM (within 1 hour of waking)</li>
          <li>• Lunch: 12-1 PM (largest meal of the day)</li>
          <li>• Dinner: 6-7 PM (light, at least 2-3 hours before bed)</li>
          <li>• Snacks: Mid-morning and mid-afternoon if needed</li>
        </ul>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WeeklyMealPlan;
