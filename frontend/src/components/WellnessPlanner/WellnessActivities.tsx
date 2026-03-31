import React from 'react';
import { WellnessActivity, CyclePhase, ActivityType } from '../../types';

interface WellnessActivitiesProps {
  activities: WellnessActivity[];
  cyclePhase: CyclePhase;
}

const WellnessActivities: React.FC<WellnessActivitiesProps> = ({
  activities,
  cyclePhase,
}) => {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'yoga':
        return '🧘';
      case 'meditation':
        return '🧘‍♀️';
      case 'exercise':
        return '🏃‍♀️';
      default:
        return '✨';
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'yoga':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
          badge: 'bg-purple-100 text-purple-700',
          gradient: 'from-purple-500 to-violet-500',
          leftBorder: 'border-l-purple-400',
          benefitBg: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'meditation':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          text: 'text-indigo-700',
          badge: 'bg-indigo-100 text-indigo-700',
          gradient: 'from-indigo-500 to-blue-500',
          leftBorder: 'border-l-indigo-400',
          benefitBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'exercise':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-700',
          badge: 'bg-orange-100 text-orange-700',
          gradient: 'from-orange-500 to-amber-500',
          leftBorder: 'border-l-orange-400',
          benefitBg: 'bg-orange-50 text-orange-700 border-orange-200',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-700',
          gradient: 'from-gray-500 to-slate-500',
          leftBorder: 'border-l-gray-400',
          benefitBg: 'bg-gray-50 text-gray-700 border-gray-200',
        };
    }
  };

  const getPhaseDescription = (phase: CyclePhase) => {
    switch (phase) {
      case 'menstrual':
        return 'Focus on gentle, restorative practices during this time of rest and renewal.';
      case 'follicular':
        return 'Energy is building - great time to try new activities and increase intensity.';
      case 'ovulatory':
        return 'Peak energy phase - ideal for challenging workouts and social activities.';
      case 'luteal':
        return 'Energy is winding down - balance activity with rest and self-care.';
      default:
        return '';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No activities available for this phase.</p>
      </div>
    );
  }

  // Group activities by type
  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.type]) {
      acc[activity.type] = [];
    }
    acc[activity.type].push(activity);
    return acc;
  }, {} as Record<ActivityType, WellnessActivity[]>);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🧘</span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Wellness Activities
            </h3>
            <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-xs font-medium">
              ✨ AI Recommended
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 ml-[52px]">
          {getPhaseDescription(cyclePhase)}
        </p>
      </div>

      {/* Activity Cards */}
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const colors = getActivityColor(activity.type);
          return (
            <div
              key={index}
              className={`rounded-2xl border ${colors.border} border-l-4 ${colors.leftBorder} ${colors.bg} p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} shadow-sm flex items-center justify-center text-2xl`}>
                    <span className="drop-shadow-sm">{getActivityIcon(activity.type)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className={`font-semibold ${colors.text}`}>
                      {activity.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors.badge}`}>
                      {activity.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      ⏱️ {activity.duration}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-3">
                    {activity.description}
                  </p>

                  {/* Benefits */}
                  {activity.benefits && activity.benefits.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Benefits:</p>
                      <div className="flex flex-wrap gap-2">
                        {activity.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs border ${colors.benefitBg} hover:scale-110 transition-transform duration-200 cursor-default`}
                          >
                            ✓ {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Summary by Type */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {(['yoga', 'meditation', 'exercise'] as ActivityType[]).map((type) => {
          const count = groupedActivities[type]?.length || 0;
          const colors = getActivityColor(type);
          return (
            <div
              key={type}
              className={`text-center p-4 rounded-2xl ${colors.bg} border ${colors.border} shadow-sm hover:scale-105 hover:shadow-lg transition-all duration-300`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-xl mx-auto mb-2 shadow-sm`}>
                <span>{getActivityIcon(type)}</span>
              </div>
              <p className={`font-medium capitalize ${colors.text}`}>{type}</p>
              <p className="text-xs text-gray-500">{count} {count === 1 ? 'activity' : 'activities'}</p>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm">💡</span>
          </div>
          <h4 className="font-medium text-purple-800">Activity Tips for {cyclePhase.charAt(0).toUpperCase() + cyclePhase.slice(1)} Phase</h4>
        </div>
        <ul className="text-sm text-purple-700 space-y-1.5 ml-12">
          {cyclePhase === 'menstrual' && (
            <>
              <li>• Listen to your body and rest when needed</li>
              <li>• Avoid inversions and intense core work</li>
              <li>• Focus on gentle stretching and relaxation</li>
            </>
          )}
          {cyclePhase === 'follicular' && (
            <>
              <li>• Great time to try new activities</li>
              <li>• Gradually increase workout intensity</li>
              <li>• Focus on building strength and endurance</li>
            </>
          )}
          {cyclePhase === 'ovulatory' && (
            <>
              <li>• Take advantage of peak energy levels</li>
              <li>• Challenge yourself with harder workouts</li>
              <li>• Great time for group activities</li>
            </>
          )}
          {cyclePhase === 'luteal' && (
            <>
              <li>• Reduce intensity as energy decreases</li>
              <li>• Focus on stress-relieving activities</li>
              <li>• Practice self-compassion and patience</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default WellnessActivities;
