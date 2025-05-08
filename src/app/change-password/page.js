import { redirect } from 'next/navigation';
import { hashPassword } from '@/lib/auth';
import pool from '@/lib/db';

const ChangePasswordPage = () => {
  const handleChangePassword = async (formData) => {
    'use server';
    const { newPassword, confirmPassword } = Object.fromEntries(formData);

    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const hashedPassword = await hashPassword(newPassword);
    const client = await pool.connect();
    try {
      await client.query('UPDATE users SET password_hash = $1, first_login = FALSE WHERE username = $2', [hashedPassword, 'admin']);
    } finally {
      client.release();
    }

    redirect('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form action={handleChangePassword} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Change Password</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
            New Password
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="New Password"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;