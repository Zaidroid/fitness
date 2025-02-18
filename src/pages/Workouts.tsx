import React from 'react';
import { Plus, Play, MoreVertical } from 'lucide-react';
import { useWorkout, type WorkoutType } from '../lib/hooks/useWorkout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const exercises = [
  { name: 'Pull-ups', category: 'Upper Body', difficulty: 'Intermediate' },
  { name: 'Push-ups', category: 'Upper Body', difficulty: 'Beginner' },
  { name: 'Dips', category: 'Upper Body', difficulty: 'Intermediate' },
  { name: 'Squats', category: 'Lower Body', difficulty: 'Beginner' },
  { name: 'Pistol Squats', category: 'Lower Body', difficulty: 'Advanced' },
  { name: 'Plank', category: 'Core', difficulty: 'Beginner' },
  { name: 'L-Sit', category: 'Core', difficulty: 'Advanced' },
];

const recentWorkouts = [
  {
    date: '2024-03-05',
    duration: '45 min',
    exercises: ['Pull-ups', 'Push-ups', 'Dips'],
    effort: 8,
  },
  {
    date: '2024-03-03',
    duration: '35 min',
    exercises: ['Squats', 'Plank', 'L-Sit'],
    effort: 7,
  },
];

export default function Workouts() {
  const navigate = useNavigate();
  const { isLoading, activeWorkout, startWorkout } = useWorkout();

  const handleQuickStart = async (type: WorkoutType) => {
    if (activeWorkout) {
      toast.error('You already have an active workout');
      return;
    }

    try {
      await startWorkout(type);
      navigate('/progress');
    } catch (error) {
      toast.error('Failed to start workout');
    }
  };

  const handleNewWorkout = () => {
    if (activeWorkout) {
      toast.error('Please complete your active workout first');
      return;
    }
    navigate('/progress');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Workouts</h1>
        <button 
          onClick={handleNewWorkout}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Workout
        </button>
      </div>

      {/* Quick Start Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleQuickStart('upper_body')}
            disabled={isLoading}
            className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50"
          >
            <div className="text-center">
              <Play className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Upper Body
              </span>
            </div>
          </button>
          <button 
            onClick={() => handleQuickStart('lower_body')}
            disabled={isLoading}
            className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50"
          >
            <div className="text-center">
              <Play className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Lower Body
              </span>
            </div>
          </button>
          <button 
            onClick={() => handleQuickStart('full_body')}
            disabled={isLoading}
            className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50"
          >
            <div className="text-center">
              <Play className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Full Body
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Exercise Library */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Exercise Library</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exercise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exercises.map((exercise) => (
                <tr key={exercise.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {exercise.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exercise.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exercise.difficulty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Workouts</h2>
        <div className="space-y-4">
          {recentWorkouts.map((workout, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{workout.date}</p>
                <p className="text-sm text-gray-500">
                  {workout.exercises.join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Duration: {workout.duration}
                </p>
                <p className="text-sm text-gray-500">
                  Effort Level: {workout.effort}/10
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}