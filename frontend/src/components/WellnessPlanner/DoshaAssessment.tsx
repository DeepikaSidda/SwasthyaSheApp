import React, { useState, useEffect } from 'react';
import { DoshaQuestion, DoshaAssessmentAnswer, DoshaType } from '../../types';
import DoshaQuestionComponent from './DoshaQuestion';

interface DoshaAssessmentProps {
  questions: DoshaQuestion[];
  onComplete: (answers: DoshaAssessmentAnswer[]) => Promise<void>;
  onCancel?: () => void;
  initialAnswers?: Record<string, DoshaType>;
}

const DoshaAssessment: React.FC<DoshaAssessmentProps> = ({
  questions,
  onComplete,
  onCancel,
  initialAnswers,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, DoshaType>>(initialAnswers ?? {});
  const [submitting, setSubmitting] = useState(false);

  // Sync answers when initialAnswers prop changes (e.g. pre-fill from history)
  useEffect(() => {
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      setAnswers(initialAnswers);
    }
  }, [initialAnswers]);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ primary: DoshaType; scores: Record<DoshaType, number> } | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (questionId: string, doshaType: DoshaType) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: doshaType,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateResult = () => {
    const scores: Record<DoshaType, number> = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(answers).forEach((doshaType) => {
      scores[doshaType]++;
    });

    const sortedDoshas = (Object.entries(scores) as [DoshaType, number][])
      .sort((a, b) => b[1] - a[1]);
    
    return {
      primary: sortedDoshas[0][0],
      scores,
    };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Calculate and show result first
      const calculatedResult = calculateResult();
      setResult(calculatedResult);
      setShowResult(true);

      // Prepare answers for API
      const assessmentAnswers: DoshaAssessmentAnswer[] = Object.entries(answers).map(
        ([questionId, doshaType]) => ({
          questionId,
          selectedOption: doshaType,
          doshaType,
          score: 1,
        })
      );

      await onComplete(assessmentAnswers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save assessment');
      setShowResult(false);
    } finally {
      setSubmitting(false);
    }
  };

  const isCurrentAnswered = currentQuestion && answers[currentQuestion.id];
  const allAnswered = questions.every((q) => answers[q.id]);

  const getDoshaInfo = (dosha: DoshaType) => {
    switch (dosha) {
      case 'vata':
        return {
          color: 'blue' as const,
          emoji: '💨',
          element: 'Air & Space',
          traits: ['Creative', 'Energetic', 'Adaptable', 'Quick-thinking'],
          description: 'Vata types are creative, energetic, and adaptable. They tend to be thin, have dry skin, and prefer warm climates.',
        };
      case 'pitta':
        return {
          color: 'red' as const,
          emoji: '🔥',
          element: 'Fire & Water',
          traits: ['Focused', 'Ambitious', 'Determined', 'Intelligent'],
          description: 'Pitta types are focused, ambitious, and determined. They have a medium build, warm body temperature, and strong digestion.',
        };
      case 'kapha':
        return {
          color: 'green' as const,
          emoji: '🌍',
          element: 'Earth & Water',
          traits: ['Calm', 'Nurturing', 'Stable', 'Patient'],
          description: 'Kapha types are calm, nurturing, and stable. They tend to have a larger build, smooth skin, and steady energy.',
        };
    }
  };

  // Show result screen
  if (showResult && result) {
    const doshaInfo = getDoshaInfo(result.primary);
    const colorClasses = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      red: 'bg-red-100 border-red-300 text-red-800',
      green: 'bg-green-100 border-green-300 text-green-800',
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{doshaInfo.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Primary Dosha</h2>
          <div className={`inline-block px-6 py-3 rounded-full text-xl font-semibold capitalize border-2 ${colorClasses[doshaInfo.color]}`}>
            {result.primary}
          </div>
          <p className="text-gray-600 mt-2">{doshaInfo.element}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-gray-700 text-center">{doshaInfo.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Traits</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {doshaInfo.traits.map((trait, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-full text-sm border ${colorClasses[doshaInfo.color]}`}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Dosha Balance</h3>
          <div className="space-y-3">
            {(['vata', 'pitta', 'kapha'] as DoshaType[]).map((dosha) => {
              const info = getDoshaInfo(dosha);
              const percentage = (result.scores[dosha] / totalQuestions) * 100;
              const barColors = {
                vata: 'bg-blue-500',
                pitta: 'bg-red-500',
                kapha: 'bg-green-500',
              };
              return (
                <div key={dosha}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 capitalize flex items-center gap-2">
                      {info.emoji} {dosha}
                    </span>
                    <span className="font-medium">{result.scores[dosha]} / {totalQuestions}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColors[dosha]} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Your personalized wellness plan is being prepared...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading assessment questions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Dosha Assessment</h2>
        <p className="text-purple-100 text-sm">
          Answer these questions to discover your Ayurvedic constitution
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <DoshaQuestionComponent
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id] || null}
          onAnswerSelect={(doshaType: DoshaType) => handleAnswerSelect(currentQuestion.id, doshaType)}
        />
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
        </div>

        <div className="flex gap-2">
          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isCurrentAnswered}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Complete Assessment'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Question Navigation Dots */}
      <div className="px-6 pb-6 border-t border-gray-100 pt-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-purple-600 text-white'
                  : answers[q.id]
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoshaAssessment;
