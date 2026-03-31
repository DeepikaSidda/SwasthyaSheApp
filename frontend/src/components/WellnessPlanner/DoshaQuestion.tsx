import React from 'react';
import { DoshaQuestion, DoshaType } from '../../types';

interface DoshaQuestionProps {
  question: DoshaQuestion;
  selectedAnswer: DoshaType | null;
  onAnswerSelect: (doshaType: DoshaType) => void;
}

interface DoshaOption {
  doshaType: DoshaType;
  text: string;
  emoji: string;
  color: string;
  hoverColor: string;
  selectedColor: string;
}

// Question-specific options mapping
const getOptionsForQuestion = (questionId: string): DoshaOption[] => {
  const optionsMap: Record<string, DoshaOption[]> = {
    q1: [
      { doshaType: 'vata', text: 'Thin, light frame, difficulty gaining weight', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Medium, athletic build, moderate weight', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Larger, solid frame, gains weight easily', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q2: [
      { doshaType: 'vata', text: 'Dry, rough, thin skin', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Warm, oily, prone to redness', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Smooth, thick, moist skin', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q3: [
      { doshaType: 'vata', text: 'Dry, frizzy, or curly hair', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Fine, straight, prone to early graying', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Thick, wavy, lustrous hair', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q4: [
      { doshaType: 'vata', text: 'Variable, sometimes forget to eat', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Strong, get irritable if meals are delayed', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Steady, can skip meals without discomfort', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q5: [
      { doshaType: 'vata', text: 'Irregular, prone to gas and bloating', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Strong, quick digestion, prone to acidity', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Slow, steady digestion', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q6: [
      { doshaType: 'vata', text: 'Become anxious, worried, or fearful', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Become irritable, angry, or critical', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Become withdrawn, sad, or lethargic', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q7: [
      { doshaType: 'vata', text: 'Light, interrupted, difficulty falling asleep', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Moderate, wake up feeling alert', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Deep, heavy, hard to wake up', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q8: [
      { doshaType: 'vata', text: 'Variable, bursts of energy then fatigue', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'High, focused energy throughout the day', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Steady, consistent but slow to start', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q9: [
      { doshaType: 'vata', text: 'Quickly, but may change mind often', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Decisively, with clear reasoning', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Slowly, after careful consideration', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q10: [
      { doshaType: 'vata', text: 'Prefer warm, dislike cold', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Prefer cool, dislike heat', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Adaptable, but dislike cold and damp', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q11: [
      { doshaType: 'vata', text: 'Quick to learn, quick to forget', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Sharp, focused, good recall', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Slow to learn, but excellent long-term memory', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q12: [
      { doshaType: 'vata', text: 'Fast, light steps', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Moderate, purposeful stride', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Slow, steady, graceful', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q13: [
      { doshaType: 'vata', text: 'Irregular cycles, scanty flow, with cramps', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Regular, heavy flow, with heat and irritability', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Regular, moderate flow, with water retention', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q14: [
      { doshaType: 'vata', text: 'Anxious, restless, or fearful before period', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Irritable, frustrated, or angry before period', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Emotional, clingy, or lethargic before period', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
    q15: [
      { doshaType: 'vata', text: 'Get tired quickly, prefer gentle movement', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
      { doshaType: 'pitta', text: 'Enjoy competitive, intense workouts', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
      { doshaType: 'kapha', text: 'Good stamina but slow to start exercising', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
    ],
  };

  return optionsMap[questionId] || [
    { doshaType: 'vata', text: 'Vata option', emoji: '🌬️', color: 'border-blue-200', hoverColor: 'hover:border-blue-400 hover:bg-blue-50', selectedColor: 'border-blue-500 bg-blue-50' },
    { doshaType: 'pitta', text: 'Pitta option', emoji: '🔥', color: 'border-red-200', hoverColor: 'hover:border-red-400 hover:bg-red-50', selectedColor: 'border-red-500 bg-red-50' },
    { doshaType: 'kapha', text: 'Kapha option', emoji: '🌍', color: 'border-green-200', hoverColor: 'hover:border-green-400 hover:bg-green-50', selectedColor: 'border-green-500 bg-green-50' },
  ];
};

const DoshaQuestionComponent: React.FC<DoshaQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
}) => {
  const options = getOptionsForQuestion(question.id);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{question.question}</h3>
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.doshaType;
          return (
            <button
              key={option.doshaType}
              onClick={() => onAnswerSelect(option.doshaType)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? option.selectedColor
                  : `${option.color} ${option.hoverColor}`
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{option.emoji}</span>
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {option.doshaType}
                    </span>
                  </div>
                  <p className="text-gray-700">{option.text}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DoshaQuestionComponent;
