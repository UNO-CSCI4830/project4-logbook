'use client';
import { useEffect, useState } from 'react';
import { UserService } from '@/lib/services/UserService';
import { User } from '@/lib/models/User';
import { useToast } from '@/contexts/ToastContext';
import { useUserRefresh } from '@/contexts/UserContext';

const userService = new UserService();

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { triggerRefresh } = useUserRefresh();

  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setName(userData.name);
      setEmail(userData.email);
      setLoading(false);
    } catch (error) {
      showToast('Failed to load user data', 'error');
      setLoading(false);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();

    // Check if email is being changed
    const emailChanged = user && email !== user.email;

    // Confirm if making changes
    if (!confirm('Are you sure you want to update your profile?')) {
      return;
    }

    // Extra confirmation for email changes
    if (emailChanged) {
      if (!confirm('Changing your email will log you out and you will need to login again with your new email. Continue?')) {
        return;
      }
    }

    setSaving(true);

    try {
      const updatedUser = await userService.updateProfile({ name, email });
      setUser(updatedUser);

      if (emailChanged) {
        showToast('Email updated! Please login with your new email.', 'success');
        // Wait a moment for the user to see the message
        setTimeout(() => {
          // Clear auth token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }, 2000);
      } else {
        showToast('Profile updated successfully', 'success');
        // Trigger navbar refresh to update displayed name
        triggerRefresh();
      }
    } catch (error: any) {
      if (error.message.includes('Email already in use')) {
        showToast('Email is already in use by another account', 'error');
      } else {
        showToast('Failed to update profile', 'error');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    // Confirm password change
    if (!confirm('Are you sure you want to change your password?')) {
      return;
    }

    setSaving(true);

    try {
      await userService.changePassword({
        currentPassword,
        newPassword
      });
      showToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.message.includes('Current password is incorrect')) {
        showToast('Current password is incorrect', 'error');
      } else {
        showToast('Failed to change password', 'error');
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500 p-4">Loading...</div>;
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* Profile Settings Section */}
      <section className="bg-white rounded-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Profile Settings</h1>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </section>

      {/* Password Change Section */}
      <section className="bg-white rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
