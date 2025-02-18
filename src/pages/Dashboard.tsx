import React from 'react';
import { 
  Activity,
  Heart,
  Footprints,
  Moon,
  Flame,
  Timer,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import { GoogleFitButton } from '../components/GoogleFitButton';
import { useGoogleFit } from '../lib/hooks/useGoogleFit';
import { formatDate } from '../lib/utils';

export default function Dashboard() {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const { data, isLoading, lastSync, refreshData } = useGoogleFit(accessToken);

  const stats = [
    { 
      name: 'Heart Rate', 
      value: data ? `${data.heartRate.average} bpm` : '--', 
      icon: Heart, 
      color: 'text-red-500' 
    },
    { 
      name: 'Steps', 
      value: data ? data.steps.toLocaleString() : '--', 
      icon: Footprints, 
      color: 'text-blue-500' 
    },
    { 
      name: 'Sleep', 
      value: data ? `${(data.sleep.durationMinutes / 60).toFixed(1)} hrs` : '--', 
      icon: Moon, 
      color: 'text-purple-500' 
    },
    { 
      name: 'Calories', 
      value: data ? data.calories.toLocaleString() : '--', 
      icon: Flame, 
      color: 'text-orange-500' 
    },
    { 
      name: 'Active Minutes', 
      value: data ? `${data.activeMinutes} min` : '--', 
      icon: Timer, 
      color: 'text-green-500' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {accessToken ? (
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          ) : (
            <GoogleFitButton onSuccess={setAccessToken} />
          )}
          {lastSync && (
            <span className="text-sm text-gray-600">
              Last sync: {formatDate(lastSync)}
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </dd>
            </div>
          );
        })}
      </div>

      {data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Heart Rate</h3>
              <div className="mt-2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { time: 'Min', value: data.heartRate.min },
                    { time: 'Avg', value: data.heartRate.average },
                    { time: 'Max', value: data.heartRate.max },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ef4444" 
                      fill="#fee2e2" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Activity Overview</h3>
              <div className="mt-2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { metric: 'Steps', value: data.steps / 100 },
                    { metric: 'Calories', value: data.calories / 100 },
                    { metric: 'Active Min', value: data.activeMinutes },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      fill="#dbeafe" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}