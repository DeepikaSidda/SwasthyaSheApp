import React, { useEffect, useState } from 'react';
import { CyclePrediction } from '../../types';

interface CyclePredictionCardProps {
  prediction: CyclePrediction | null;
  currentCycleDay: number | null;
}

const CyclePredictionCard: React.FC<CyclePredictionCardProps> = ({
  prediction,
  currentCycleDay,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdownValue, setCountdownValue] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animate countdown number
  useEffect(() => {
    if (prediction) {
      const target = getDaysUntil(prediction.nextPeriodStart);
      let current = 0;
      const increment = Math.ceil(target / 20);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCountdownValue(target);
          clearInterval(timer);
        } else {
          setCountdownValue(current);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prediction]);

  const formatDateRange = (start: Date, end: Date): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getConfidenceColor = (confidence: 'low' | 'medium' | 'high'): string => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-red-100 text-red-700';
    }
  };

  const getConfidenceLabel = (confidence: 'low' | 'medium' | 'high'): string => {
    switch (confidence) {
      case 'high':
        return 'High Confidence';
      case 'medium':
        return 'Medium Confidence';
      case 'low':
        return 'Low Confidence';
    }
  };

  const getDaysUntil = (date: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (!prediction) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Predictions</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Not Enough Data</h3>
          <p className="text-gray-500 text-sm">
            Log at least 3 cycles to get accurate predictions for your next period, fertile window, and PMS days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-500 hover:shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Predictions</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${getConfidenceColor(prediction.confidence)}`}>
          {getConfidenceLabel(prediction.confidence)}
        </span>
      </div>

      {/* Next Period Countdown */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 mb-6 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Next Period</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatDateRange(prediction.nextPeriodStart, prediction.nextPeriodEnd)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-red-500 transition-all duration-300">{countdownValue}</p>
            <p className="text-sm text-gray-500">days away</p>
          </div>
        </div>
      </div>

      {/* Prediction Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Fertile Window */}
        <div className="bg-green-50 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="font-medium text-gray-800">Fertile Window</h3>
          </div>
          <p className="text-sm text-gray-600">
            {formatDateRange(prediction.fertileWindowStart, prediction.fertileWindowEnd)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Ovulation: {formatDate(prediction.ovulationDate)}
          </p>
        </div>

        {/* PMS Days */}
        <div className="bg-yellow-50 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
            <h3 className="font-medium text-gray-800">PMS Days</h3>
          </div>
          <p className="text-sm text-gray-600">
            {formatDateRange(prediction.pmsStart, prediction.pmsEnd)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            7-14 days before period
          </p>
        </div>
      </div>

      {/* Cycle Stats */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Your Cycle Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-purple-50">
            <p className="text-2xl font-bold text-purple-600">{prediction.averageCycleLength}</p>
            <p className="text-xs text-gray-500">Avg. Cycle Length (days)</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-purple-50">
            <p className="text-2xl font-bold text-purple-600">{prediction.averagePeriodLength}</p>
            <p className="text-xs text-gray-500">Avg. Period Length (days)</p>
          </div>
        </div>
      </div>

      {/* Current Cycle Day */}
      {currentCycleDay && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Cycle Day</span>
            <span className="text-lg font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Day {currentCycleDay}
            </span>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-gray-400 text-center">
        Predictions are based on your logged data and may vary. Not intended for medical use.
      </p>
    </div>
  );
};

export default CyclePredictionCard;
