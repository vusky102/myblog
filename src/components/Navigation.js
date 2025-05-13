'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const avatarRef = useRef(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#232526] shadow-lg z-50 border-b border-[#222] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/"
            className="text-cyan-300 font-bold text-xl tracking-widest hover:text-white transition-all duration-300 relative group"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full" />
          </Link>

          <div className="flex gap-4 items-center">
            {user && (
              <button
                onClick={() => router.push('/admin')}
                className="text-cyan-300 hover:text-white transition-all duration-300 relative group font-semibold"
              >
                Post
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full" />
              </button>
            )}

            {user ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-cyan-300 hover:text-white transition-all duration-300 relative group font-semibold"
              >
                Logout
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full" />
              </button>
            ) : (
              <Link
                href="/login"
                className="text-cyan-300 hover:text-white transition-all duration-300 relative group font-semibold"
              >
                Login
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full" />
              </Link>
            )}

            {/* Avatar + tooltip */}
            <div className="ml-6 flex items-center">
              <div
                ref={avatarRef}
                className="avatar-glow group relative cursor-pointer"
                onClick={() => setShowTooltip((v) => !v)}
              >
                <img
                  src="/static/avatar.jpg"
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-lg transition-transform duration-300 group-hover:scale-110"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-cyan-400 blur-lg opacity-60 group-hover:opacity-90 transition-all" />

                <div
                  className={[
                    'absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50',
                    'min-w-[320px] max-w-xs',
                    'bg-gradient-to-br from-[#1a2636] via-[#232526] to-[#2c5364] bg-opacity-90',
                    'border border-cyan-400 rounded-xl shadow-2xl p-5',
                    'flex flex-col gap-3 text-left text-cyan-100 backdrop-blur-lg',
                    'transition-opacity duration-300',
                    'opacity-0 pointer-events-none',
                    'group-hover:opacity-100 group-hover:pointer-events-auto',
                    showTooltip && 'opacity-100 pointer-events-auto',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg text-cyan-300">
                      Son Vu (Lucas)
                    </span>
                    <span className="text-xs bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded ml-2">
                      Full-stack Developer
                    </span>
                  </div>
                  <div className="flex gap-4 mb-1">
                    <a
                      href="https://github.com/vusky102"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="hover:scale-110 transition-transform"
                    >
                      {/* GitHub SVG */}
                    </a>
                    <a
                      href="https://www.linkedin.com/in/lucasvu102/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="hover:scale-110 transition-transform"
                    >
                      {/* LinkedIn SVG */}
                    </a>
                    <a
                      href="https://stackoverflow.com/users/24184682/lucas"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="StackOverflow"
                      className="hover:scale-110 transition-transform"
                    >
                      {/* StackOverflow SVG */}
                    </a>
                  </div>
                  <div className="text-xs text-cyan-100 mb-1 leading-snug">
                    Versatile Full-Stack Developer, proficient in Python and
                    Java for enterprise-level and rapid-development projects.
                    Holds an MBA in Marketing & Finance, blending technical
                    expertise with business acumen to deliver complex solutions.
                    Skilled in API integration, database management, scalable
                    system design, networking, and cloud architectures.
                  </div>
                  <div className="text-[11px] text-cyan-200 italic opacity-80">
                    A space to navigate the fast-changing tech industry and
                    chronicle my ongoing learning journey.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#181c20] p-6 rounded-lg shadow-2xl border border-cyan-400">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">
              Confirm Logout
            </h3>
            <p className="mb-4 text-gray-200">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-cyan-300 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
