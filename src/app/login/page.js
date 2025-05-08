'use client';

import { handleLogin } from './actions';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (formData) => {
    try {
      const { user, token } = await handleLogin(formData);
      if (token) {
        login(user, token);
        router.push('/');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      document.getElementById('error-message').textContent = errorMessage;
      document.getElementById('error-container').classList.remove('hidden');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form action={onSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h2>
        <div id="error-container" className="hidden mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p id="error-message" className="text-sm"></p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;