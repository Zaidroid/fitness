import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Calendar, Trophy, TrendingUp } from 'lucide-react';

const mockProgressData = [
  { date: '2024-03-01', pullUps: 8, pushUps: 20, dips: 12 },
  { date: '2024-03-08', pullUps: 10, pushUps: 25, dips: 15 },
  { date: '2024-03-15', pullUps: 12, pushUps: 30, dips: 18 },
  { date: '2024-03-22', pullUps: 15, pushUps: 35, dips: 20 },
];

const achievements = [
  {
    title: '10 Pull-ups Club',
    description: 'Completed 10 consecutive pull-ups',
    date: '2024-03-08',
    icon: Trophy,
  },
  {
    title: 'Consistency King',
    description: '4 weeks of regular training',
    date: '2024-03-22',
    icon: Calendar,
  },
  {
    title: 'Progress Master',
    description: '50% improvement in push-ups',
    date: '2024-03-15',
    icon: TrendingUp,
  },
];

export default function Progress() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
      </div>

      {/* Progress Charts */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Exercise Progress</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="pullUps" 
                stroke="#3b82f6" 
                name="Pull-ups"
              />
              <Line 
                type="monotone" 
                dataKey="pushUps" 
                stroke="#ef4444" 
                name="Push-ups"
              />
              <Line 
                type="monotone" 
                dataKey="dips" 
                stroke="#10b981" 
                name="Dips"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.title}
                className="p-4 border rounded-lg bg-gradient-to-br from-indigo-50 to-white"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{achievement.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}