import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchBar } from './Search';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signIn, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Back Button - shows on all sub-pages */}
            {!isHomePage && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-9 h-9 rounded-full text-purple-600 hover:bg-purple-50 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Logo/Home Link */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">🌸</span>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent tracking-tight">
                  Swasthyashe
                </span>
                <span className="text-[11px] text-gray-400 -mt-0.5 tracking-widest uppercase">Women's Wellness</span>
              </div>
            </Link>
          </div>

          {/* Right side - Search, Auth controls, and Mobile menu button */}
          <div className="flex items-center gap-2">
            {/* Search Bar - hidden on mobile, visible on md+ */}
            <div className="hidden md:block">
              <SearchBar className="w-64" />
            </div>

            {/* Auth controls */}
            {!user ? (
              <button
                onClick={signIn}
                className="px-4 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
              >
                Sign In
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/profile" aria-label="View profile">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={signOut}
                  className="px-3 py-1.5 text-sm font-medium text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-600 hover:text-purple-700 hover:bg-purple-50 focus:outline-none md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white`}>
        <div className="pt-2 pb-3 space-y-1">
          {/* Mobile Search Bar */}
          <div className="px-3 py-2">
            <SearchBar className="w-full" />
          </div>
          
          {/* New Features Section */}
          <div className="px-3 py-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
            Features
          </div>
          <Link
            to="/cycle-tracker"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
          >
            Cycle Tracker
          </Link>
          <Link
            to="/symptom-tracker"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
          >
            Symptom Tracker
          </Link>
          <Link
            to="/wellness-planner"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
          >
            Wellness Planner
          </Link>
          
          {/* Health Topics Section */}
          <div className="px-3 py-2 mt-2 text-xs font-semibold text-purple-600 uppercase tracking-wider border-t border-gray-200 pt-3">
            Health Topics
          </div>
          <Link
            to="/period-health"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
          >
            Period Health
          </Link>
          <Link
            to="/mental-wellness"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
          >
            Mental Wellness
          </Link>
          <Link
            to="/sexual-health"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
          >
            Sexual Health
          </Link>
          <Link
            to="/skin-hair-care"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
          >
            Skin & Hair Care
          </Link>
          <Link
            to="/pregnancy-care"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
          >
            Pregnancy Care
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
