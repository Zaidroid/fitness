/*
  # Initial Schema for Calisthenics Training App

  1. New Tables
    - users
      - Extends Supabase auth.users
      - Stores user profile information
    - workouts
      - Stores workout sessions
      - Links to user
    - exercises
      - Stores exercise definitions
      - Includes difficulty levels and categories
    - workout_exercises
      - Junction table for workouts and exercises
      - Stores sets, reps, and performance data
    - health_metrics
      - Stores daily health data
      - Includes heart rate, steps, sleep, etc.

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- Create custom types
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE exercise_category AS ENUM ('upper_body', 'lower_body', 'core', 'cardio', 'flexibility');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category exercise_category NOT NULL,
  difficulty difficulty_level NOT NULL,
  demo_url text,
  created_at timestamptz DEFAULT now(),
  is_custom boolean DEFAULT false,
  user_id uuid REFERENCES users(id),
  CONSTRAINT exercises_name_unique UNIQUE (name, user_id)
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text,
  notes text,
  duration_minutes integer,
  effort_level integer CHECK (effort_level BETWEEN 1 AND 10),
  started_at timestamptz NOT NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create workout_exercises table
CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  sets integer NOT NULL,
  reps integer NOT NULL,
  weight_kg numeric(5,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (workout_id, exercise_id)
);

-- Create health_metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  heart_rate_avg integer,
  steps_count integer,
  sleep_hours numeric(4,2),
  calories_burned integer,
  active_minutes integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, date)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can read public exercises"
  ON exercises
  FOR SELECT
  USING (is_custom = false OR user_id = auth.uid());

CREATE POLICY "Users can create custom exercises"
  ON exercises
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_custom = true);

CREATE POLICY "Users can manage their workouts"
  ON workouts
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their workout exercises"
  ON workout_exercises
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their health metrics"
  ON health_metrics
  FOR ALL
  USING (user_id = auth.uid());

-- Create functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert default exercises
INSERT INTO exercises (name, description, category, difficulty, is_custom)
VALUES
  ('Push-ups', 'Basic upper body exercise', 'upper_body', 'beginner', false),
  ('Pull-ups', 'Advanced upper body exercise', 'upper_body', 'intermediate', false),
  ('Squats', 'Basic lower body exercise', 'lower_body', 'beginner', false),
  ('Plank', 'Basic core exercise', 'core', 'beginner', false),
  ('Dips', 'Intermediate upper body exercise', 'upper_body', 'intermediate', false),
  ('Pistol Squats', 'Advanced lower body exercise', 'lower_body', 'advanced', false),
  ('L-Sit', 'Advanced core exercise', 'core', 'advanced', false);