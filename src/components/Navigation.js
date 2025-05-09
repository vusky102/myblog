'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#232526] shadow-lg z-50 border-b border-[#222] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-cyan-300 font-bold text-xl tracking-widest hover:text-white transition-all duration-300 nav-link relative group">
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
          </Link>
          <div className="flex gap-4 items-center">
            {user && (
              <button
                onClick={() => router.push('/admin')}
                className="text-cyan-300 hover:text-white transition-all duration-300 nav-link relative group font-semibold"
              >
                Post
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
              </button>
            )}
            {user ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-cyan-300 hover:text-white transition-all duration-300 nav-link relative group font-semibold"
              >
                Logout
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
              </button>
            ) : (
              <Link href="/login" className="text-cyan-300 hover:text-white transition-all duration-300 nav-link relative group font-semibold">
                Login
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
              </Link>
            )}
            <div className="ml-6 flex items-center">
              <div className="avatar-glow group relative cursor-pointer">
                <img src="/static/avatar.jpg" alt="Avatar" className="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-cyan-400/50" />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-cyan-400 blur-lg opacity-60 group-hover:opacity-90 transition-all"></span>
                {/* Tooltip bubble on hover */}
                <div className="pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 min-w-[320px] max-w-xs bg-gradient-to-br from-[#1a2636] via-[#232526] to-[#2c5364] bg-opacity-90 border border-cyan-400 rounded-xl shadow-2xl p-5 flex flex-col gap-3 text-left text-cyan-100 backdrop-blur-lg">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg text-cyan-300">Son Vu (Lucas)</span>
                    <span className="text-xs bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded ml-2">Full-stack Developer</span>
                  </div>
                  <div className="flex gap-4 mb-1">
                    <a href="https://github.com/vusky102" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:scale-110 transition-transform">
                      <svg width="22" height="22" fill="currentColor" className="text-cyan-400" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/lucasvu102/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:scale-110 transition-transform">
                      <svg width="22" height="22" fill="currentColor" className="text-cyan-400" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.043 0 3.604 2.004 3.604 4.609v5.587z"/></svg>
                    </a>
                    <a href="https://stackoverflow.com/users/24184682/lucas" target="_blank" rel="noopener noreferrer" aria-label="StackOverflow" className="hover:scale-110 transition-transform">
                      <svg width="22" height="22" fill="currentColor" className="text-cyan-400" viewBox="0 0 24 24"><path d="M17.473 20.291v-5.568h1.568v7.136h-15.082v-7.136h1.568v5.568zm-10.568-2.568h8.432v-1.568h-8.432zm.568-2.568l8.232 1.712.328-1.552-8.232-1.712zm1.136-2.568l7.568 3.424.656-1.472-7.568-3.424zm2.272-2.568l6.424 5.136 1.008-1.264-6.424-5.136zm4.272-2.568l4.568 7.136 1.344-.864-4.568-7.136z"/></svg>
                    </a>
                  </div>
                  <div className="text-xs text-cyan-100 mb-1 leading-snug">
                    Versatile Full-Stack Developer, proficient in Python and Java for enterprise-level and rapid-development projects. Holds an MBA in Marketing & Finance, blending technical expertise with business acumen to deliver complex solutions. Skilled in API integration, database management, scalable system design, networking, and cloud architectures.
                  </div>
                  <div className="text-[11px] text-cyan-200 italic opacity-80">
                    A space to navigate the fast-changing tech industry and chronicle my ongoing learning journey.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#181c20] p-6 rounded-lg shadow-2xl border border-cyan-400">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">Confirm Logout</h3>
            <p className="mb-4 text-gray-200">Are you sure you want to logout?</p>
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