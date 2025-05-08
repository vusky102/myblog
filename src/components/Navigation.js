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
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <div className="flex gap-4">
            {user && (
              <button
                onClick={() => router.push('/admin')}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Post
              </button>
            )}
            {user ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-gray-900 transition-colors">
                Login
              </Link>
            )}
            {showLogoutConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                  <p className="mb-4">Are you sure you want to logout?</p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      No
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowLogoutConfirm(false);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}