import { useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { toast } from 'sonner';

export type WorkoutType = 'upper_body' | 'lower_body' | 'full_body';

interface WorkoutSession {
  id: string;
  type: WorkoutType;
  startedAt: Date;
  exercises: Array<{
    id: string;
    name: string;
    sets: number;
    reps: number;
  }>;
}

export function useWorkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);

  const startWorkout = useCallback(async (type: WorkoutType) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          name: `${type.replace('_', ' ')} Workout`,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setActiveWorkout({
        id: data.id,
        type,
        startedAt: new Date(data.started_at),
        exercises: [],
      });

      toast.success('Workout started');
    } catch (error) {
      toast.error('Failed to start workout');
      console.error('Error starting workout:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const endWorkout = useCallback(async (effortLevel: number) => {
    if (!activeWorkout) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('workouts')
        .update({
          completed_at: new Date().toISOString(),
          effort_level: effortLevel,
        })
        .eq('id', activeWorkout.id);

      if (error) throw error;

      setActiveWorkout(null);
      toast.success('Workout completed');
    } catch (error) {
      toast.error('Failed to end workout');
      console.error('Error ending workout:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeWorkout]);

  return {
    isLoading,
    activeWorkout,
    startWorkout,
    endWorkout,
  };
}