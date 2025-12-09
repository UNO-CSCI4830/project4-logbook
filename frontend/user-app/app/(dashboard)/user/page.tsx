import EventCalendar from '@/components/EventCalendar';
import Image from 'next/image';
import Link from 'next/link';

const UserPage = () => {

  return (
    <div className="flex flex-col xl:flex-row gap-4 p-4">
      {/* Left/Center Content Area */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {/* Appliance Overview Card */}
        <div className="bg-grey-100 p-6 rounded-lg shadow-xl hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/home.png" 
                alt="Overview" 
                width={40} 
                height={40}
              />
              <h2 className="text-2xl font-semibold text-gray-800">Appliance Overview</h2>
            </div>
            <Link href="/list/appliances">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                View All
              </button>
            </Link>
          </div>

          {/* Total Appliances */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-600">14</span>
              <span className="text-lg text-gray-600">Total Appliances</span>
            </div>
          </div>

          {/* By Category */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">By Category</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-purple-300 shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Kitchen</span>
                <span className="text-lg font-bold text-gray-700">6</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-purple-300 shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Laundry</span>
                <span className="text-lg font-bold text-gray-700">3</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-purple-300 shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">HVAC</span>
                <span className="text-lg font-bold text-gray-700">2</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-purple-300 shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Other</span>
                <span className="text-lg font-bold text-gray-700">3</span>
              </div>
            </div>
          </div>

          {/* No Reminders Alert */}
          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
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
                  <span className="font-bold text-amber-700">5 appliances</span> have no reminders set
                </p>
                <p className="text-xs text-gray-600 mb-3">Refrigerator, Microwave, Toaster, Coffee Maker, Blender</p>
                <Link href="/list/appliances">
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                    Add Reminders
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Status Box */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
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
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
              2 Active Alerts
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">HVAC Filter Overdue</h3>
                  <p className="text-sm text-gray-600">Central Air System - Filter replacement past due by 5 days</p>
                </div>
                <Link href="/list/appliances">
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium underline">
                    View
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">Dishwasher Warranty Expiring</h3>
                  <p className="text-sm text-gray-600">Extended warranty expires in 14 days</p>
                </div>
                <Link href="/list/appliances">
                  <button className="text-amber-600 hover:text-amber-700 text-sm font-medium underline">
                    View
                  </button>
                </Link>
              </div>
            </div>
          </div>
          
          <Link href="/list/appliances">
            <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
              View All Appliances
            </button>
          </Link>
        </div>

        {/* Timeline/Activity Feed - Bigger Box */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Activity Timeline</h1>
            <Image 
              src="/announcement.png" 
              alt="Timeline" 
              width={30} 
              height={30}
            />
          </div>
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
        </div>
      </div>

      {/* Right Sidebar - Calendar */}
      <div className="w-full xl:w-1/3">
        <EventCalendar />
      </div>
    </div>
  );
};

export default UserPage;
