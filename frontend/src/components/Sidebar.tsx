import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  const featureItems = [
    { path: '/cycle-tracker', label: 'Cycle Tracker', icon: '🌙', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50' },
    { path: '/symptom-tracker', label: 'Symptom Tracker', icon: '🌿', color: 'from-green-500 to-teal-500', bg: 'bg-green-50' },
    { path: '/wellness-planner', label: 'Wellness Planner', icon: '🧘', color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50' },
  ];

  const healthItems = [
    { path: '/period-health', label: 'Period Health', icon: '❤️', bg: 'bg-red-50', hoverBg: 'hover:bg-red-100' },
    { path: '/mental-wellness', label: 'Mental Wellness', icon: '🧠', bg: 'bg-blue-50', hoverBg: 'hover:bg-blue-100' },
    { path: '/sexual-health', label: 'Sexual Health', icon: '💜', bg: 'bg-purple-50', hoverBg: 'hover:bg-purple-100' },
    { path: '/skin-hair-care', label: 'Skin & Hair Care', icon: '✨', bg: 'bg-amber-50', hoverBg: 'hover:bg-amber-100' },
    { path: '/pregnancy-care', label: 'Pregnancy Care', icon: '🤰', bg: 'bg-rose-50', hoverBg: 'hover:bg-rose-100' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <span className="sr-only">Open menu</span>
        <svg className="h-6 w-6 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      
      <div className={`bg-white w-72 flex flex-col h-full fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition-all duration-300 ease-in-out shadow-xl z-30 border-r border-gray-100`}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <Link to="/" className="flex items-center justify-center group">
            <img 
              src="/images/logo-bg.jpg" 
              alt="Swasthyashe Logo" 
              className="h-20 sm:h-24 md:h-28 w-auto object-contain transition-all duration-300 group-hover:scale-105" 
            />
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          {/* Features Section */}
          <div className="mb-4">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Features</p>
            <div className="space-y-1">
              {featureItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                        : `${item.bg} text-gray-700 hover:shadow-sm hover:translate-x-1`
                    }`}
                    style={{ 
                      transitionDelay: isVisible ? `${index * 50}ms` : '0ms',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                    }}
                  >
                    <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-125'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-3 my-3 border-t border-gray-100"></div>

          {/* Health Topics Section */}
          <div className="mb-4">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Health Topics</p>
            <div className="space-y-1">
              {healthItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-purple-100 text-purple-700 shadow-sm ring-1 ring-purple-200'
                        : `${item.bg} ${item.hoverBg} text-gray-600 hover:translate-x-1 hover:shadow-sm`
                    }`}
                    style={{ 
                      transitionDelay: isVisible ? `${(index + 3) * 50}ms` : '0ms',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                    }}
                  >
                    <span className={`text-base transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-125'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <svg className="ml-auto w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* About App Section */}
        <div className="p-3 border-t border-gray-100">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌸</span>
              <h3 className="text-lg font-semibold text-purple-700">Grandma's Healing Touch</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Swasthyashe is born from the belief that women's health is a journey nurtured by both ancient traditions and modern science. At the heart of this app lies the timeless wisdom of Indian <strong>Bhammas</strong> (grandmothers), who have been the original healers in every household, offering remedies rooted in nature and tradition. Their knowledge—of herbs that soothe, foods that heal, and rituals that strengthen—has been passed down through generations, forming the foundation of holistic well-being.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Enriched by contemporary research, Swasthyashe blends this ancestral knowledge with modern scientific insights, ensuring that every recommendation is both time-tested and evidence-based. The app guides women through every stage of life, from managing menstrual health and pregnancy care to supporting mental wellness and skin care.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              It's not just about treatment but about embracing a lifestyle that honors the body, mind, and spirit. Swasthyashe empowers women with natural remedies, mindful practices, and scientific tips, fostering resilience, confidence, and long-term vitality. It celebrates the strength of women and the enduring wisdom of <strong>Bhammas</strong>, creating a space where tradition meets innovation for holistic well-being.
            </p>

            <h3 className="text-lg font-semibold text-purple-700 mb-3">Vedic Wisdom for Health</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5">🌿</span>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Ayurveda (Science of Life)</strong>: Originating from the Atharva Veda, Ayurveda focuses on balancing the three doshas—Vata, Pitta, and Kapha—using natural healing, diet, and herbal remedies.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5">🧘‍♀️</span>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Yoga (Union of Body and Mind)</strong>: Rooted in the Rig Veda, yoga promotes physical and mental well-being through asanas, pranayama, and meditation.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5">🔥</span>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Yajurveda (Rituals and Discipline)</strong>: Emphasizes disciplined living and rituals that cultivate mindfulness and balance.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5">✨</span>
                <p className="text-sm text-gray-600"><strong className="text-gray-700">Atharva Veda (Healing and Medicine)</strong>: Offers insights into herbal medicine, spiritual healing, and ancient chants for holistic wellness.</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-purple-100/50">
              <span>Version 1.0.0</span>
              <span>© 2025 Swasthyashe</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
};

export default Sidebar;
