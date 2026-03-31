import React, { useState, useMemo, useEffect } from 'react';
import { CycleCalendar, CycleLogForm, CyclePredictionCard } from '../components/CycleTracker';
import { useCycleData } from '../hooks/useCycleData';
import { CycleEntry } from '../types';

const CycleTracker: React.FC = () => {
  const { cycles, predictions, loading, error, logCycle, updateCycle, deleteCycle, refetch } = useCycleData();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [loading]);

  // Find if selected date has an existing cycle entry
  const existingEntry = useMemo((): CycleEntry | undefined => {
    if (!selectedDate) return undefined;
    
    return cycles.find(cycle => {
      const startDate = new Date(cycle.startDate);
      const endDate = cycle.endDate ? new Date(cycle.endDate) : new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000);
      
      return selectedDate >= startDate && selectedDate <= endDate;
    });
  }, [selectedDate, cycles]);

  // Calculate current cycle day
  const currentCycleDay = useMemo((): number | null => {
    if (cycles.length === 0) return null;
    
    const sortedCycles = [...cycles].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    
    const lastCycle = sortedCycles[0];
    const lastPeriodStart = new Date(lastCycle.startDate);
    const today = new Date();
    
    const diffTime = today.getTime() - lastPeriodStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays > 0 ? diffDays : null;
  }, [cycles]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleFormSubmit = async (entry: { startDate: string; endDate?: string; flowIntensity: 'light' | 'medium' | 'heavy' }) => {
    if (existingEntry) {
      await updateCycle(existingEntry.startDate, entry);
    } else {
      await logCycle(entry);
    }
    setShowForm(false);
    setSelectedDate(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedDate(null);
  };

  const handleDeleteCycle = async (startDate: string) => {
    if (window.confirm('Are you sure you want to delete this cycle entry?')) {
      setDeletingId(startDate);
      setTimeout(async () => {
        await deleteCycle(startDate);
        setDeletingId(null);
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🌸</span>
              </div>
            </div>
            <p className="text-gray-600 animate-pulse">Loading your cycle data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundImage: 'url("/images/home-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
    <div className={`max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header with fade-in animation */}
      <div className={`mb-8 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Cycle Tracker
        </h1>
        <p className="text-gray-600">
          Track your menstrual cycle, view predictions, and understand your body better.
        </p>
      </div>

      {/* Error Alert with shake animation */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between animate-shake">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="text-red-600 hover:text-red-800 text-sm font-medium hover:scale-105 transition-transform"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State - Show when no cycles logged */}
      {cycles.length === 0 && !showForm && (
        <div className={`mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 text-center transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="text-6xl mb-4 animate-bounce-slow">🌸</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Start Tracking Your Cycle</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Log your first period to begin tracking. The more cycles you log, the more accurate your predictions will become.
          </p>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setShowForm(true);
            }}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Log Your First Period
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Calendar - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 transform transition-all duration-300 hover:scale-[1.01]">
          <CycleCalendar
            cycles={cycles}
            predictions={predictions}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>

        {/* Sidebar - Predictions and Form */}
        <div className="space-y-6">
          {/* Show form when date is selected, otherwise show predictions */}
          <div className={`transition-all duration-300 ${showForm ? 'animate-slideIn' : ''}`}>
            {showForm ? (
              <CycleLogForm
                onSubmit={handleFormSubmit}
                initialDate={selectedDate || undefined}
                existingEntry={existingEntry}
                onCancel={handleFormCancel}
              />
            ) : (
              <>
                <CyclePredictionCard
                  prediction={predictions}
                  currentCycleDay={currentCycleDay}
                />
                
                {/* Quick Log Button */}
                <button
                  onClick={() => {
                    setSelectedDate(new Date());
                    setShowForm(true);
                  }}
                  className="w-full py-3 px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Log Period
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Cycles History */}
      {cycles.length > 0 && (
        <div className={`mt-8 transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Cycle History</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flow
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...cycles]
                    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map((cycle, index) => {
                      const startDate = new Date(cycle.startDate);
                      const endDate = cycle.endDate ? new Date(cycle.endDate) : null;
                      const duration = endDate
                        ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                        : null;
                      const isDeleting = deletingId === cycle.startDate;

                      return (
                        <tr 
                          key={index} 
                          className={`hover:bg-gray-50 transition-all duration-300 ${isDeleting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {endDate
                              ? endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : <span className="animate-pulse text-purple-500">Ongoing</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {duration ? `${duration} days` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-all duration-300 hover:scale-110 ${
                              cycle.flowIntensity === 'light'
                                ? 'bg-pink-100 text-pink-700'
                                : cycle.flowIntensity === 'medium'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {cycle.flowIntensity.charAt(0).toUpperCase() + cycle.flowIntensity.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => {
                                setSelectedDate(new Date(cycle.startDate));
                                setShowForm(true);
                              }}
                              className="text-purple-600 hover:text-purple-800 mr-3 hover:scale-110 transition-all duration-200 inline-block"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCycle(cycle.startDate)}
                              className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200 inline-block"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className={`mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">💡 Cycle Tracking Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-white/90">
            <h3 className="font-medium text-gray-800 mb-2">Track Consistently</h3>
            <p className="text-sm text-gray-600">
              Log your period as soon as it starts for more accurate predictions over time.
            </p>
          </div>
          <div className="bg-white/70 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-white/90">
            <h3 className="font-medium text-gray-800 mb-2">Note Your Flow</h3>
            <p className="text-sm text-gray-600">
              Recording flow intensity helps identify patterns and changes in your cycle.
            </p>
          </div>
          <div className="bg-white/70 rounded-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-white/90">
            <h3 className="font-medium text-gray-800 mb-2">Be Patient</h3>
            <p className="text-sm text-gray-600">
              Predictions improve with more data. Log at least 3 cycles for best results.
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
    </div>
  );
};

export default CycleTracker;
