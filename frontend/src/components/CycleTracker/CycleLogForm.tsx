import React, { useState, useEffect } from 'react';
import { CycleLogInput, FlowIntensity, CycleEntry } from '../../types';

interface CycleLogFormProps {
  onSubmit: (entry: CycleLogInput) => Promise<void>;
  initialDate?: Date;
  existingEntry?: CycleEntry;
  onCancel?: () => void;
}

const CycleLogForm: React.FC<CycleLogFormProps> = ({
  onSubmit,
  initialDate,
  existingEntry,
  onCancel,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>('medium');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  useEffect(() => {
    if (existingEntry) {
      setStartDate(existingEntry.startDate.split('T')[0]);
      setEndDate(existingEntry.endDate ? existingEntry.endDate.split('T')[0] : '');
      setFlowIntensity(existingEntry.flowIntensity);
    } else if (initialDate) {
      setStartDate(initialDate.toISOString().split('T')[0]);
    }
  }, [existingEntry, initialDate]);

  const validateForm = (): boolean => {
    setError(null);

    if (!startDate) {
      setError('Start date is required');
      return false;
    }

    const start = new Date(startDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (start > today) {
      setError('Start date cannot be in the future');
      return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (end < start) {
        setError('End date must be after start date');
        return false;
      }
      if (end > today) {
        setError('End date cannot be in the future');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        startDate,
        endDate: endDate || undefined,
        flowIntensity,
      });

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form on success
        if (!existingEntry) {
          setStartDate('');
          setEndDate('');
          setFlowIntensity('medium');
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const flowOptions: { value: FlowIntensity; label: string; description: string; emoji: string }[] = [
    { value: 'light', label: 'Light', description: 'Spotting or light flow', emoji: '💧' },
    { value: 'medium', label: 'Medium', description: 'Normal flow', emoji: '💧💧' },
    { value: 'heavy', label: 'Heavy', description: 'Heavy flow', emoji: '💧💧💧' },
  ];

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'} ${showSuccess ? 'ring-2 ring-green-500' : ''}`}>
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl z-10 animate-fadeIn">
          <div className="text-center">
            <div className="text-5xl mb-2 animate-bounce">✓</div>
            <p className="text-green-600 font-medium">Saved!</p>
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">{existingEntry ? '✏️' : '📝'}</span>
        {existingEntry ? 'Update Period' : 'Log Period'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Start Date */}
        <div className={`transition-all duration-300 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
            required
          />
        </div>

        {/* End Date */}
        <div className={`transition-all duration-300 delay-150 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
          />
          <p className="mt-1 text-sm text-gray-500">
            You can add this later when your period ends
          </p>
        </div>

        {/* Flow Intensity */}
        <div className={`transition-all duration-300 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Flow Intensity <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {flowOptions.map((option, index) => (
              <label
                key={option.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                  flowIntensity === option.value
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <input
                  type="radio"
                  name="flowIntensity"
                  value={option.value}
                  checked={flowIntensity === option.value}
                  onChange={(e) => setFlowIntensity(e.target.value as FlowIntensity)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                  flowIntensity === option.value
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                }`}>
                  {flowIntensity === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white animate-scaleIn"></div>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{option.label}</span>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                <span className="text-lg">{option.emoji}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className={`flex gap-3 transition-all duration-300 delay-250 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg ${
              onCancel ? '' : 'w-full'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : existingEntry ? (
              'Update'
            ) : (
              'Log Period'
            )}
          </button>
        </div>
      </form>

      {/* Custom animations */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CycleLogForm;
