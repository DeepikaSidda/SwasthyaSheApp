import React, { useState } from 'react';
import {
  SymptomLogInput,
  SelectedSymptom,
  EnergyLevel,
  SymptomOption,
  SymptomSeverity,
} from '../../types';
import SymptomSelector from './SymptomSelector';

interface SymptomLogFormProps {
  onSubmit: (entry: SymptomLogInput) => Promise<void>;
  date: Date;
  onDateChange: (date: Date) => void;
}

const SymptomLogForm: React.FC<SymptomLogFormProps> = ({ onSubmit, date, onDateChange }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSymptomToggle = (symptom: SymptomOption, severity?: SymptomSeverity) => {
    if (severity === undefined) {
      // Remove symptom
      setSelectedSymptoms((prev) => prev.filter((s) => s.id !== symptom.id));
    } else {
      // Add symptom
      setSelectedSymptoms((prev) => [
        ...prev,
        {
          id: symptom.id,
          category: symptom.category,
          name: symptom.name,
          severity,
        },
      ]);
    }
  };

  const handleSeverityChange = (symptomId: string, severity: SymptomSeverity) => {
    setSelectedSymptoms((prev) =>
      prev.map((s) => (s.id === symptomId ? { ...s, severity } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        date: date.toISOString().split('T')[0],
        symptoms: selectedSymptoms,
        energyLevel,
        notes: notes.trim() || undefined,
      });

      // Reset form on success
      setSelectedSymptoms([]);
      setEnergyLevel('medium');
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save symptoms');
    } finally {
      setIsSubmitting(false);
    }
  };

  const energyOptions: { value: EnergyLevel; label: string; emoji: string }[] = [
    { value: 'low', label: 'Low', emoji: '😴' },
    { value: 'medium', label: 'Medium', emoji: '😊' },
    { value: 'high', label: 'High', emoji: '⚡' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-sm">
          <span className="text-white text-lg">📝</span>
        </div>
        Log Symptoms
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Picker */}
        <div>
          <label htmlFor="symptomDate" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            id="symptomDate"
            value={date.toISOString().split('T')[0]}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Symptom Selector */}
        <SymptomSelector
          selectedSymptoms={selectedSymptoms}
          onSymptomToggle={handleSymptomToggle}
          onSeverityChange={handleSeverityChange}
        />

        {/* Energy Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Energy Level
          </label>
          <div className="flex gap-3">
            {energyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setEnergyLevel(option.value)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 hover:scale-105 active:scale-95 transition-all duration-200 ${
                  energyLevel === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-1">{option.emoji}</div>
                <div className={`text-sm font-medium ${
                  energyLevel === option.value ? 'text-purple-700' : 'text-gray-600'
                }`}>
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Any additional notes about how you're feeling..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || selectedSymptoms.length === 0}
          className="w-full py-3 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Log Symptoms
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SymptomLogForm;
