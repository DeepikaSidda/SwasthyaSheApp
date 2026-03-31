import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HealthProfile {
  name: string;
  contactNumber: string;
  email: string;
  dateOfBirth: string;
  bloodGroup: string;
  height: string;
  weight: string;
}

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '';

const defaultProfile: HealthProfile = {
  name: '', contactNumber: '', email: '',
  dateOfBirth: '', bloodGroup: '', height: '', weight: '',
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ProfilePage: React.FC = () => {
  const { user, isLoading, signIn } = useAuth();
  const [profile, setProfile] = useState<HealthProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch profile once on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_ENDPOINT}/profile?userId=demo-user`);
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            const p = { ...defaultProfile, ...data.profile };
            setProfile(p);
            const hasData = p.name || p.contactNumber || p.email || p.dateOfBirth || p.bloodGroup || p.height || p.weight;
            if (hasData) setIsEditing(false);
          }
        }
      } catch {
        // API unavailable
      }
    };
    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field: keyof HealthProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      const res = await fetch(`${API_ENDPOINT}/profile?userId=demo-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Profile save failed:', res.status, errText);
        throw new Error(`Save failed: ${res.status}`);
      }
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Profile save error:', err);
      setSaveError('Failed to save profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please sign in to view your profile</p>
          <button onClick={signIn} className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundImage: 'url("/images/home-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
    <div className="max-w-2xl mx-auto mt-8 mb-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-purple-600 to-purple-400" />
        <div className="flex flex-col items-center -mt-14 pb-6 px-6">
          {user.picture ? (
            <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white object-cover shadow" />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white bg-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="mt-4 text-xl font-semibold text-gray-900">{user.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg mt-6 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-purple-700">🌸 Women's Health Profile</h2>
          {isEditing ? (
            <button onClick={handleSave}
              className="px-5 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
              Save
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)}
              className="px-5 py-1.5 text-sm font-medium text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors">
              Edit
            </button>
          )}
        </div>

        {saved && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            ✅ Profile saved successfully!
          </div>
        )}

        {saveError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            ❌ {saveError}
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              {isEditing ? (
                <input type="text" value={profile.name} onChange={e => handleChange('name', e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none" />
              ) : (
                <p className="text-sm text-gray-800 py-2 px-3 bg-gray-50 rounded-lg min-h-[38px]">{profile.name || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Contact Number</label>
              {isEditing ? (
                <input type="tel" value={profile.contactNumber} onChange={e => handleChange('contactNumber', e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none" />
              ) : (
                <p className="text-sm text-gray-800 py-2 px-3 bg-gray-50 rounded-lg min-h-[38px]">{profile.contactNumber || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              {isEditing ? (
                <input type="email" value={profile.email} onChange={e => handleChange('email', e.target.value)}
                  placeholder="e.g. priya@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none" />
              ) : (
                <p className="text-sm text-gray-800 py-2 px-3 bg-gray-50 rounded-lg min-h-[38px]">{profile.email || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
              {isEditing ? (
                <input type="date" value={profile.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none" />
              ) : (
                <p className="text-sm text-gray-800 py-2 px-3 bg-gray-50 rounded-lg min-h-[38px]">{profile.dateOfBirth || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Blood Group</label>
              {isEditing ? (
                <select value={profile.bloodGroup} onChange={e => handleChange('bloodGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none bg-white">
                  <option value="">Select...</option>
                  {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              ) : (
                <p className="text-sm text-gray-800 py-2 px-3 bg-gray-50 rounded-lg min-h-[38px]">{profile.bloodGroup || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Height (cm)</label>
              {isEditing ? (
                <input type="number" value={profile.height} onChange={e => handleChange('height', e.target.value)}
                  placeholder="e.g. 160"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none" />
              ) : (
                <p className="text-sm text-gray-800 py-2 px-3 bg-gray-50 rounded-lg min-h-[38px]">{profile.height || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Weight (kg)</label>
              {isEditing ? (
                <input type="number" value={profile.weight} onChange={e => handleChange('weight', e.target.value)}
                  placeholder="e.g. 55"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none" />
              ) : (
                <p className="text-sm text-gray-800 py-2 px-3 bg-gray-50 rounded-lg min-h-[38px]">{profile.weight || '—'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;
