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
            <h3 className="text-sm font-semibold text-gray-700 mb-3">By Category</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-purple-300">
                <span className="text-sm font-medium text-gray-700">Kitchen</span>
                <span className="text-lg font-bold text-blue-600">6</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-300">
                <span className="text-sm font-medium text-gray-700">Laundry</span>
                <span className="text-lg font-bold text-purple-600">3</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-purple-300">
                <span className="text-sm font-medium text-gray-700">HVAC</span>
                <span className="text-lg font-bold text-green-600">2</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-purple-300">
                <span className="text-sm font-medium text-gray-700">Other</span>
                <span className="text-lg font-bold text-amber-600">3</span>
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
                <p className="text-sm font-medium text-gray-800">
                  <span className="font-bold text-amber-700">5 appliances</span> have no reminders set
                </p>
                <Link href="/list/appliances">
                  <button className="text-sm text-amber-700 hover:text-amber-800 font-medium mt-1 underline">
                    Add reminders →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Status Box */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

          <Link href="/list/appliances">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-green-500">
              <div className="flex flex-col items-center text-center">
                <Image 
                  src="/announcement.png" 
                  alt="Alerts" 
                  width={48} 
                  height={48}
                  className="mb-3"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Alerts & Status</h2>
                <p className="text-sm text-gray-600">
                  Check appliance alerts and current status
                </p>
                <div className="mt-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    2 Active Alerts
                  </span>
                </div>
              </div>
            </div>
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
