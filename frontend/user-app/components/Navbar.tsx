'use client'
import Image from "next/image"
import Link from "next/link"
import { useRouter} from "next/navigation"
import { useState, useEffect, useRef} from "react"
import { ApiClient } from '@/lib/services/ApiClient'
import { Appliance } from '@/lib/models/Appliance'
import { useAlertRefresh } from '@/contexts/AlertContext'
import { UserService } from '@/lib/services/UserService'
import { useUser } from '@/contexts/UserContext'

const api = new ApiClient();
const userService = new UserService();

const Navbar = () => {
  const router = useRouter();
  const [alertCount, setAlertCount] = useState(0);
  const [alertAppliances, setAlertAppliances] = useState<Appliance[]>([]);
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { refreshTrigger } = useAlertRefresh();
  const { user, setUser, refreshTrigger: userRefreshTrigger } = useUser();

  const handleLogout = () => {
    router.push('/login');
  };

  useEffect(() => {
    fetchAlerts();
    fetchUserInfo();
    // Refresh alerts every 60 seconds
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  // Refresh when triggered by other components
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchAlerts();
    }
  }, [refreshTrigger]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAlertDropdown(false);
      }
    }

    if (showAlertDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAlertDropdown]);

  async function fetchAlerts() {
    try {
      const userId = 1; // Hardcoded for now
      const response = await api.http.get(`/api/${userId}/appliances/alerts`);
      const appliances = response.data.map((a: any) => Appliance.fromJSON(a));
      setAlertAppliances(appliances);
      setAlertCount(appliances.length);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  }

  async function fetchUserInfo() {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Keep user as null if fetch fails
    }
  }

  // Refresh user when triggered by other components
  useEffect(() => {
    if (userRefreshTrigger > 0) {
      fetchUserInfo();
    }
  }, [userRefreshTrigger]);


  return (
    <div className='flex items-center justify-between p-4'>
      {/* Icons and users */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/message.png" alt="" width={20} height={20}/>
        </div>
        <div className='relative' ref={dropdownRef}>
          <div
            className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'
            onClick={() => setShowAlertDropdown(!showAlertDropdown)}
          >
            <Image src="/announcement.png" alt="" width={20} height={20}/>
            {alertCount > 0 && (
              <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs'>
                {alertCount}
              </div>
            )}
          </div>

          {showAlertDropdown && (
            <div className='absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto'>
              <div className='p-3 border-b border-gray-200 bg-gray-50'>
                <h3 className='font-semibold text-sm'>Maintenance Alerts</h3>
                <p className='text-xs text-gray-600 mt-1'>
                  {alertCount === 0 ? 'No alerts due' : `${alertCount} appliance${alertCount > 1 ? 's' : ''} need${alertCount === 1 ? 's' : ''} attention`}
                </p>
              </div>

              {alertAppliances.length === 0 ? (
                <div className='p-4 text-center text-gray-500 text-sm'>
                  No maintenance alerts at this time
                </div>
              ) : (
                <div className='divide-y divide-gray-100'>
                  {alertAppliances.map((appliance) => (
                    <Link
                      key={appliance.id}
                      href={`/list/appliances/${appliance.id}/view`}
                      onClick={() => setShowAlertDropdown(false)}
                      className='block p-3 hover:bg-gray-50 transition'
                    >
                      <div className='flex items-start justify-between gap-2'>
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm text-gray-900 truncate'>
                            {appliance.name}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            {appliance.brand} {appliance.model}
                          </p>
                          <p className='text-xs text-gray-600 mt-1'>
                            Due: {appliance.alertDate ? new Date(appliance.alertDate + 'T00:00:00').toLocaleDateString() : '—'}
                          </p>
                        </div>
                        <div className='flex-shrink-0'>
                          <span className='inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded'>
                            {appliance.alertStatus || 'ACTIVE'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {alertAppliances.length > 0 && (
                <div className='p-2 border-t border-gray-200 bg-gray-50'>
                  <Link
                    href='/list/appliances'
                    onClick={() => setShowAlertDropdown(false)}
                    className='block text-center text-sm text-purple-600 hover:text-purple-700 font-medium py-1'
                  >
                    View all appliances
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        <div className='flex flex-col'>
          <span className="text-xs leading-3 font-medium">{user?.name || 'User'}</span>
          <span className="text-[10px] text-gray-500 text-right">User</span>
        </div>
        <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2"
        >
          <Image src="/logout.png" alt="logout" width={16} height={16}/>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar