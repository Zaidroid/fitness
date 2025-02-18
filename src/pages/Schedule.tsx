import React from 'react';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';

const upcomingWorkouts = [
  {
    date: '2024-03-25',
    time: '07:00 AM',
    type: 'Upper Body',
    exercises: ['Pull-ups', 'Push-ups', 'Dips'],
  },
  {
    date: '2024-03-27',
    time: '06:30 AM',
    type: 'Lower Body',
    exercises: ['Squats', 'Lunges', 'Calf Raises'],
  },
  {
    date: '2024-03-29',
    time: '07:30 AM',
    type: 'Core',
    exercises: ['Plank', 'L-Sit', 'Leg Raises'],
  },
];

export default function Schedule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Workout Schedule</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-5 w-5 mr-2" />
          Schedule Workout
        </button>
      </div>

      {/* Calendar View */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Calendar</h2>
        <div className="border rounded-lg min-h-[400px] flex items-center justify-center text-gray-500">
          Calendar Component Coming Soon
        </div>
      </div>

      {/* Upcoming Workouts */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Workouts</h2>
        <div className="space-y-4">
          {upcomingWorkouts.map((workout, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 rounded-lg p-3">
                  <CalendarIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{workout.type}</h3>
                  <p className="text-sm text-gray-500">
                    {workout.exercises.join(', ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-gray-900">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{workout.time}</span>
                </div>
                <p className="text-sm text-gray-500">{workout.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}