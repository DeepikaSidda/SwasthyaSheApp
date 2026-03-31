import React, { useState, useMemo } from 'react';
import { CycleEntry, CyclePrediction } from '../../types';

interface CycleCalendarProps {
  cycles: CycleEntry[];
  predictions: CyclePrediction | null;
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

type DateType = 'period' | 'predicted-period' | 'fertile' | 'pms' | 'ovulation' | 'regular';

const CycleCalendar: React.FC<CycleCalendarProps> = ({
  cycles,
  predictions,
  onDateSelect,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add padding for days before the first day of the month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    // Add padding for days after the last day of the month
    const endPadding = 6 - lastDay.getDay();
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }, [currentMonth]);

  const getDateType = (date: Date): DateType => {
    if (isNaN(date.getTime())) return 'regular';
    const dateStr = date.toISOString().split('T')[0];
    const dateTime = date.getTime();

    // Check if date is a logged period
    for (const cycle of cycles) {
      const startDate = new Date(cycle.startDate);
      const endDate = cycle.endDate ? new Date(cycle.endDate) : new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000);
      
      if (dateTime >= startDate.getTime() && dateTime <= endDate.getTime()) {
        return 'period';
      }
    }

    // Check predictions
    if (predictions) {
      const safeGetTime = (d: Date) => {
        const t = d?.getTime?.();
        return (t && !isNaN(t)) ? t : NaN;
      };

      // Predicted period
      const ppStart = safeGetTime(predictions.nextPeriodStart);
      const ppEnd = safeGetTime(predictions.nextPeriodEnd);
      if (!isNaN(ppStart) && !isNaN(ppEnd) && dateTime >= ppStart && dateTime <= ppEnd) {
        return 'predicted-period';
      }

      // Ovulation day
      const ovTime = safeGetTime(predictions.ovulationDate);
      if (!isNaN(ovTime)) {
        const ovStr = predictions.ovulationDate.toISOString().split('T')[0];
        if (dateStr === ovStr) {
          return 'ovulation';
        }
      }

      // Fertile window
      const fwStart = safeGetTime(predictions.fertileWindowStart);
      const fwEnd = safeGetTime(predictions.fertileWindowEnd);
      if (!isNaN(fwStart) && !isNaN(fwEnd) && dateTime >= fwStart && dateTime <= fwEnd) {
        return 'fertile';
      }

      // PMS days
      const pmsStart = safeGetTime(predictions.pmsStart);
      const pmsEnd = safeGetTime(predictions.pmsEnd);
      if (!isNaN(pmsStart) && !isNaN(pmsEnd) && dateTime >= pmsStart && dateTime <= pmsEnd) {
        return 'pms';
      }
    }

    return 'regular';
  };

  const getDateStyles = (date: Date, dateType: DateType): string => {
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

    let baseStyles = 'w-10 h-10 rounded-full flex items-center justify-center text-sm cursor-pointer transition-all duration-200 transform hover:scale-110 active:scale-95 ';
    
    if (!isCurrentMonth) {
      baseStyles += 'text-gray-300 ';
    }

    if (isSelected) {
      baseStyles += 'ring-2 ring-purple-600 ring-offset-2 scale-110 ';
    }

    if (isToday) {
      baseStyles += 'font-bold shadow-md ';
    }

    switch (dateType) {
      case 'period':
        return baseStyles + 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg';
      case 'predicted-period':
        return baseStyles + 'bg-red-200 text-red-800 hover:bg-red-300 hover:shadow-md';
      case 'ovulation':
        return baseStyles + 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg';
      case 'fertile':
        return baseStyles + 'bg-green-200 text-green-800 hover:bg-green-300 hover:shadow-md';
      case 'pms':
        return baseStyles + 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300 hover:shadow-md';
      default:
        return baseStyles + (isCurrentMonth ? 'hover:bg-gray-100 hover:shadow-sm text-gray-700' : 'hover:bg-gray-50');
    }
  };

  const getCurrentCycleDay = (): number | null => {
    if (cycles.length === 0) return null;
    
    // Sort cycles by start date descending
    const sortedCycles = [...cycles].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    
    const lastCycle = sortedCycles[0];
    const lastPeriodStart = new Date(lastCycle.startDate);
    const today = new Date();
    
    const diffTime = today.getTime() - lastPeriodStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays > 0 ? diffDays : null;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSlideDirection(direction === 'prev' ? 'right' : 'left');
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentMonth(prev => {
        const newMonth = new Date(prev);
        if (direction === 'prev') {
          newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
          newMonth.setMonth(newMonth.getMonth() + 1);
        }
        return newMonth;
      });
      setIsAnimating(false);
    }, 150);
  };

  const currentCycleDay = getCurrentCycleDay();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className={`text-xl font-semibold text-gray-800 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Current Cycle Day */}
      {currentCycleDay && (
        <div className="mb-4 text-center">
          <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium animate-pulse">
            Day {currentCycleDay} of your cycle
          </span>
        </div>
      )}

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid with animation */}
      <div className={`grid grid-cols-7 gap-1 transition-all duration-300 ${
        isAnimating 
          ? slideDirection === 'left' 
            ? 'opacity-0 -translate-x-4' 
            : 'opacity-0 translate-x-4'
          : 'opacity-100 translate-x-0'
      }`}>
        {daysInMonth.map((date, index) => {
          const dateType = getDateType(date);
          return (
            <div 
              key={index} 
              className="flex items-center justify-center py-1"
              style={{ animationDelay: `${index * 10}ms` }}
            >
              <button
                onClick={() => onDateSelect(date)}
                className={getDateStyles(date, dateType)}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
            <span className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></span>
            <span className="text-gray-600">Period</span>
          </div>
          <div className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
            <span className="w-4 h-4 rounded-full bg-red-200 shadow-sm"></span>
            <span className="text-gray-600">Predicted Period</span>
          </div>
          <div className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
            <span className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></span>
            <span className="text-gray-600">Ovulation</span>
          </div>
          <div className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
            <span className="w-4 h-4 rounded-full bg-green-200 shadow-sm"></span>
            <span className="text-gray-600">Fertile Window</span>
          </div>
          <div className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
            <span className="w-4 h-4 rounded-full bg-yellow-200 shadow-sm"></span>
            <span className="text-gray-600">PMS Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleCalendar;
