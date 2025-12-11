'use client';
import { useEffect, useState, useRef } from 'react';
import { UserService } from '@/lib/services/UserService';
import { User } from '@/lib/models/User';
import { useToast } from '@/contexts/ToastContext';
import { useUserRefresh } from '@/contexts/UserContext';

const userService = new UserService();

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { triggerRefresh } = useUserRefresh();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setBirthday(userData.birthday || '');
      setProfilePictureUrl(userData.profilePictureUrl || '');
      setLoading(false);
    } catch (error) {
      showToast('Failed to load user data', 'error');
      setLoading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfilePictureUrl(base64String);
    };
    reader.readAsDataURL(file);
  }

  function handleChangePhoto() {
    fileInputRef.current?.click();
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();

    // Confirm if making changes
    if (!confirm('Are you sure you want to update your profile?')) {
      return;
    }

    setSaving(true);

    try {
      const updatedUser = await userService.updateProfile({ 
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        birthday: birthday || undefined,
        profilePictureUrl: profilePictureUrl || undefined
      });
      
      // Update local state
      setUser(updatedUser);
      setFirstName(updatedUser.firstName || '');
      setLastName(updatedUser.lastName || '');
      setBirthday(updatedUser.birthday || '');
      setProfilePictureUrl(updatedUser.profilePictureUrl || '');

      showToast('Profile updated successfully', 'success');
      triggerRefresh();
    } catch (error: any) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500 p-4">Loading...</div>;
  }

  return (
    <div className="flex-1 p-4 flex justify-center">
      {/* Profile Section */}
      <section className="bg-white rounded-md p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">Profile</h1>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b">
            <div className="relative">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200">
                  <span className="text-4xl text-purple-600 font-bold">
                    {(firstName || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleChangePhoto}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm"
              >
                Change Photo
              </button>
              {profilePictureUrl && (
                <button
                  type="button"
                  onClick={() => setProfilePictureUrl('')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-500 text-center">Upload an image (max 5MB)</p>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
