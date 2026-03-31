import React from 'react';
import {
  SymptomOption,
  SelectedSymptom,
  SymptomSeverity,
  PHYSICAL_SYMPTOMS,
  EMOTIONAL_SYMPTOMS,
} from '../../types';

interface SymptomSelectorProps {
  selectedSymptoms: SelectedSymptom[];
  onSymptomToggle: (symptom: SymptomOption, severity?: SymptomSeverity) => void;
  onSeverityChange: (symptomId: string, severity: SymptomSeverity) => void;
}

const getSymptomEmoji = (symptomId: string): string => {
  const emojiMap: Record<string, string> = {
    cramps: '😣',
    headache: '🤕',
    bloating: '🫃',
    fatigue: '😩',
    breast_tenderness: '💗',
    back_pain: '🔙',
    nausea: '🤢',
    acne: '😖',
    insomnia: '😵',
    dizziness: '💫',
    hot_flashes: '🔥',
    joint_pain: '🦴',
    constipation: '🫠',
    mood_swings: '🎭',
    anxiety: '😰',
    irritability: '😤',
    sadness: '😢',
    stress: '😫',
    brain_fog: '🌫️',
    low_motivation: '📉',
    crying_spells: '😭',
  };
  return emojiMap[symptomId] || '•';
};

const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedSymptoms,
  onSymptomToggle,
  onSeverityChange,
}) => {
  const isSelected = (symptomId: string): boolean => {
    return selectedSymptoms.some((s) => s.id === symptomId);
  };

  const getSelectedSeverity = (symptomId: string): SymptomSeverity => {
    const symptom = selectedSymptoms.find((s) => s.id === symptomId);
    return symptom?.severity || 3;
  };


  const renderSymptomButton = (symptom: SymptomOption) => {
    const selected = isSelected(symptom.id);
    const severity = getSelectedSeverity(symptom.id);
    const isPhysical = symptom.category === 'physical';

    return (
      <div key={symptom.id} className="mb-3">
        <button
          type="button"
          onClick={() => onSymptomToggle(symptom, selected ? undefined : 3)}
          className={`w-full text-left px-4 py-3 rounded-xl border-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
            selected
              ? isPhysical
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
                : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-400'
              : 'border-gray-200 hover:border-purple-300 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-medium ${selected ? (isPhysical ? 'text-green-700' : 'text-purple-700') : 'text-gray-700'}`}>
              {getSymptomEmoji(symptom.id)} {symptom.name}
            </span>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selected
                  ? isPhysical
                    ? 'border-green-500 bg-green-500'
                    : 'border-purple-500 bg-purple-500'
                  : 'border-gray-300'
              }`}
            >
              {selected && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        </button>

        {/* Severity slider - only show when selected */}
        {selected && (
          <div className="mt-3 px-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Mild</span>
              <span>Severity: {severity}</span>
              <span>Severe</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={severity}
              onChange={(e) =>
                onSeverityChange(symptom.id, parseInt(e.target.value) as SymptomSeverity)
              }
              className="w-full h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer accent-purple-600"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={severity === num ? 'text-purple-600 font-medium' : ''}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Physical Symptoms */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">🩺</span>
          Physical Symptoms
        </h3>
        <div className="space-y-2">
          {PHYSICAL_SYMPTOMS.map(renderSymptomButton)}
        </div>
      </div>

      {/* Emotional Symptoms */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-2xl">💭</span>
          Emotional Symptoms
        </h3>
        <div className="space-y-2">
          {EMOTIONAL_SYMPTOMS.map(renderSymptomButton)}
        </div>
      </div>
    </div>
  );
};

export default SymptomSelector;