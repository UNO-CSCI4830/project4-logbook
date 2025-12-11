'use client';

import EventCalendar from '@/components/EventCalendar';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Appliance } from '@/lib/models/Appliance';
import { ApplianceService } from '@/lib/services/ApplianceService';

const service = new ApplianceService();

// Define activity types
interface ActivityItem {
  id: number;
  type: 'alert' | 'maintenance' | 'update' | 'created';
  applianceName: string;
  applianceId: number;
  description: string;
  date: string;
  status?: string;
}

const UserPage = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  // Fetch appliances on component mount
  useEffect(() => {
    async function fetchAppliances() {
      try {
        setLoading(true);
        const data = await service.list();
        setAppliances(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAppliances();
  }, []);

  // Calculate statistics
  const totalAppliances = appliances.length;

  // Count by category
  const categoryCount = appliances.reduce((acc, appliance) => {
    const category = (appliance.category || 'Other').toLowerCase();
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Predefined categories with fallback
  const categories = [
    { name: 'Kitchen', key: 'kitchen' },
    { name: 'Laundry', key: 'laundry' },
    { name: 'HVAC', key: 'hvac' },
    { name: 'Other', key: 'other' }
  ];

  // Get appliances without reminders
  const appliancesWithoutReminders = appliances.filter(a => !a.alertDate);

  // Get alerts - appliances with alert dates that are due or overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getAlertAppliances = () => {
    return appliances.filter(appliance => {
      if (!appliance.alertDate) return false;
      if (appliance.alertStatus === 'CANCELLED') return false;
      
      const alertDate = new Date(appliance.alertDate + 'T00:00:00');
      
      // If snoozed, check if snooze period has ended
      if (appliance.alertStatus === 'SNOOZED' && appliance.snoozeUntil) {
        const snoozeEndDate = new Date(appliance.snoozeUntil + 'T00:00:00');
        if (today < snoozeEndDate) return false;
      }
      
      // Show alerts that are due today or overdue
      return alertDate <= today;
    });
  };

  const alertAppliances = getAlertAppliances();

  // Get upcoming alerts (within next 30 days, not yet due)
  const getUpcomingAlerts = () => {
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return appliances
      .filter(appliance => {
        if (!appliance.alertDate) return false;
        if (appliance.alertStatus === 'CANCELLED') return false;
        
        const alertDate = new Date(appliance.alertDate + 'T00:00:00');
        return alertDate > today && alertDate <= thirtyDaysFromNow;
      })
      .sort((a, b) => {
        const dateA = new Date(a.alertDate! + 'T00:00:00');
        const dateB = new Date(b.alertDate! + 'T00:00:00');
        return dateA.getTime() - dateB.getTime();
      });
  };

  const upcomingAlerts = getUpcomingAlerts();

  // Calculate days difference
  const getDaysText = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`;
    if (diffDays < 7) return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
    return `In ${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''}`;
  };

  // Get alert severity color
  const getAlertColor = (dateString: string | undefined) => {
    if (!dateString) return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-600', badge: 'bg-gray-500' };
    
    const date = new Date(dateString + 'T00:00:00');
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', badge: 'bg-red-600' };
    if (diffDays <= 3) return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', badge: 'bg-red-600' };
    if (diffDays <= 14) return { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-600', badge: 'bg-amber-500' };
    return { bg: 'bg-blue-50', border: 'border-blue-600', text: 'text-blue-600', badge: 'bg-blue-600' };
  };

  // Generate activity log from appliance data
  const generateActivityLog = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    const now = new Date();
    
    // Add overdue alerts as HIGH priority
    alertAppliances.forEach(appliance => {
      const alertDate = new Date(appliance.alertDate! + 'T00:00:00');
      const daysOverdue = Math.ceil((now.getTime() - alertDate.getTime()) / (1000 * 60 * 60 * 24));
      
      activities.push({
        id: appliance.id!,
        type: 'alert',
        applianceName: appliance.name,
        applianceId: appliance.id!,
        description: daysOverdue > 0 
          ? `Maintenance overdue by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}`
          : `Maintenance due today`,
        date: appliance.alertDate!,
        status: appliance.alertStatus
      });
    });

    // Add snoozed items as MAINTENANCE type
    appliances
      .filter(a => a.alertStatus === 'SNOOZED' && a.snoozeUntil)
      .forEach(appliance => {
        const snoozeDate = new Date(appliance.snoozeUntil! + 'T00:00:00');
        const formattedDate = snoozeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        activities.push({
          id: appliance.id! + 10000,
          type: 'maintenance',
          applianceName: appliance.name,
          applianceId: appliance.id!,
          description: `Maintenance reminder snoozed until ${formattedDate}`,
          date: appliance.snoozeUntil!
        });
      });

    // Add upcoming alerts (next 7 days) as CREATED type
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    appliances
      .filter(a => {
        if (!a.alertDate || a.alertStatus === 'CANCELLED') return false;
        const alertDate = new Date(a.alertDate + 'T00:00:00');
        return alertDate > now && alertDate <= sevenDaysFromNow;
      })
      .forEach(appliance => {
        const alertDate = new Date(appliance.alertDate! + 'T00:00:00');
        const daysUntil = Math.ceil((alertDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        activities.push({
          id: appliance.id! + 20000,
          type: 'created',
          applianceName: appliance.name,
          applianceId: appliance.id!,
          description: `Maintenance reminder in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`,
          date: appliance.alertDate!
        });
      });

    // Add cancelled alerts as UPDATE type
    appliances
      .filter(a => a.alertStatus === 'CANCELLED' && a.alertDate)
      .slice(0, 2)
      .forEach(appliance => {
        activities.push({
          id: appliance.id! + 30000,
          type: 'update',
          applianceName: appliance.name,
          applianceId: appliance.id!,
          description: `Maintenance reminder cancelled`,
          date: appliance.alertDate!
        });
      });

    // Add appliances with recurring schedules
    appliances
      .filter(a => a.recurringInterval && a.recurringInterval !== 'NONE' && a.alertDate)
      .slice(0, 2)
      .forEach(appliance => {
        const interval = appliance.recurringInterval === 'MONTHLY' ? 'monthly' :
                        appliance.recurringInterval === 'YEARLY' ? 'yearly' :
                        `every ${appliance.recurringIntervalDays} days`;
        
        activities.push({
          id: appliance.id! + 40000,
          type: 'created',
          applianceName: appliance.name,
          applianceId: appliance.id!,
          description: `Recurring maintenance scheduled (${interval})`,
          date: appliance.alertDate!
        });
      });

    // Sort by date (most recent/urgent first)
    return activities.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      // Prioritize alerts, then by date proximity to today
      if (a.type === 'alert' && b.type !== 'alert') return -1;
      if (a.type !== 'alert' && b.type === 'alert') return 1;
      return Math.abs(now.getTime() - dateA.getTime()) - Math.abs(now.getTime() - dateB.getTime());
    }).slice(0, 8); // Show up to 8 items
  };

  const activityLog = generateActivityLog();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-4 p-4">
      {/* Left/Center Content Area */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {/* Appliance Overview Card */}
        <div className="bg-grey-500 p-4 rounded-lg shadow-md border-t-5 border-l-2 border-r-2 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/home.png" 
                alt="Overview" 
                width={40} 
                height={40}
              />
              <h2 className="text-2xl font-semibold text-gray-900">Appliance Overview</h2>
            </div>
            <Link href="/list/appliances">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                View All
              </button>
            </Link>
          </div>

          {/* Total Appliances */}
          <div className="mb-6">
            <div className="flex flex-items-center justify-center gap-2 ">
              <span className="text-3xl font-bold text-blue-700">{totalAppliances}</span>
              <span className="text-3xl font-semibold text-gray-800">Total Appliances</span>
            </div>
          </div>

          {/* By Category */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">By Category</h3>
            <div className="grid grid-cols-2 gap-4">
              {categories.map(category => (
                <Link key={category.key} href={`/list/appliances?category=${category.key}`}>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-blue-50 shadow-sm border border-gray-200 cursor-pointer transition-colors">
                    <span className="text-base font-medium text-gray-900">{category.name}</span>
                    <span className="text-xl font-semibold text-gray-700">
                      {categoryCount[category.key] || 0}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* No Reminders Alert */}
          {appliancesWithoutReminders.length > 0 && (
            <div className="p-4 bg-amber-50 border-2 border-amber-500 rounded-lg">
              <div className="flex items-start gap-3">
                <Image 
                  src="/announcement.png" 
                  alt="Alert" 
                  width={24} 
                  height={24}
                  className="flex-shrink-0 mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    <span className="font-bold text-amber-700">{appliancesWithoutReminders.length} appliance{appliancesWithoutReminders.length > 1 ? 's' : ''}</span> have no reminders set
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                    {appliancesWithoutReminders.slice(0, 5).map(a => a.name).join(', ')}
                    {appliancesWithoutReminders.length > 5 && ` and ${appliancesWithoutReminders.length - 5} more`}
                  </p>
                  <Link href="/list/appliances">
                    <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                      Add Reminders
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alerts & Status Box */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-5 border-l-2 border-r-2 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/announcement.png" 
                alt="Alerts" 
                width={40} 
                height={40}
              />
              <h2 className="text-xl font-semibold text-gray-800">Alerts & Status</h2>
            </div>
            {alertAppliances.length > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                {alertAppliances.length} Active Alert{alertAppliances.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {alertAppliances.length === 0 ? (
              <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg text-center">
                <p className="text-green-700 font-medium">✓ No active alerts</p>
                <p className="text-sm text-green-600 mt-1">All appliances are up to date</p>
              </div>
            ) : (
              alertAppliances.slice(0, 3).map(appliance => {
                const colors = getAlertColor(appliance.alertDate);
                const daysText = getDaysText(appliance.alertDate!);
                const isOverdue = daysText.includes('overdue');
                
                return (
                  <div key={appliance.id} className={`p-4 ${colors.bg} border-2 ${colors.border} rounded-lg`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{appliance.name}</h3>
                        <p className="text-sm text-gray-600">
                          {appliance.category && `${appliance.category} - `}
                          {isOverdue ? 'Maintenance overdue' : 'Maintenance due'} ({daysText})
                        </p>
                        {appliance.alertStatus === 'SNOOZED' && appliance.snoozeUntil && (
                          <p className="text-xs text-amber-600 mt-1">
                            Snoozed until {new Date(appliance.snoozeUntil + 'T00:00:00').toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Link href={`/list/appliances/${appliance.id}/view`}>
                        <button className={`${colors.text} hover:opacity-80 text-sm font-medium underline`}>
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
            
            {alertAppliances.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                And {alertAppliances.length - 3} more alert{alertAppliances.length - 3 > 1 ? 's' : ''}...
              </p>
            )}
          </div>
          
          <Link href="/list/appliances">
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              View All Appliances
            </button>
          </Link>
        </div>

        {/* Timeline/Activity Feed */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-5 border-l-2 border-r-2 border-gray-300">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Activity Timeline</h1>
            <Image 
              src="/announcement.png" 
              alt="Timeline" 
              width={30} 
              height={30}
            />
          </div>
          
          {activityLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Image 
                src="/announcement.png" 
                alt="No Activity" 
                width={48} 
                height={48}
                className="opacity-30 mb-3"
              />
              <p className="text-gray-500 text-sm">No recent activity</p>
              <p className="text-gray-400 text-xs mt-1">Your appliance updates and changes will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activityLog.map(activity => {
                const activityDate = new Date(activity.date + 'T00:00:00');
                const isOverdue = activity.type === 'alert' && activityDate < today;
                
                return (
                  <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg transition-all hover:shadow-md ${
                    activity.type === 'alert' ? 'bg-red-50 border-l-4 border-red-500' : 
                    activity.type === 'maintenance' ? 'bg-amber-50 border-l-4 border-amber-500' : 
                    activity.type === 'update' ? 'bg-gray-50 border-l-4 border-gray-400' :
                    'bg-blue-50 border-l-4 border-blue-500'
                  }`}>
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'alert' && (
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">⚠</span>
                        </div>
                      )}
                      {activity.type === 'maintenance' && (
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">🔧</span>
                        </div>
                      )}
                      {activity.type === 'created' && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">📅</span>
                        </div>
                      )}
                      {activity.type === 'update' && (
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">✓</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/list/appliances/${activity.applianceId}/view`} 
                            className="font-semibold text-gray-900 hover:text-blue-600 hover:underline block truncate"
                          >
                            {activity.applianceName}
                          </Link>
                          <p className="text-sm text-gray-700 mt-0.5">{activity.description}</p>
                        </div>
                        
                        {/* Date badge */}
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${
                          activity.type === 'alert' ? 'bg-red-100 text-red-700' :
                          activity.type === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                          activity.type === 'update' ? 'bg-gray-200 text-gray-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {activityDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      {/* Status indicator */}
                      {activity.status && (
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            activity.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            activity.status === 'SNOOZED' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* View all link */}
              {activityLog.length >= 8 && (
                <Link href="/list/appliances">
                  <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                    View All Activity →
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Calendar */}
      <div className="w-full xl:w-1/3">
        <EventCalendar appliances={appliances} />
      </div>
    </div>
  );
};

export default UserPage;
