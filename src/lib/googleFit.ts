import { startOfDay, endOfDay, subDays } from 'date-fns';

export interface FitnessData {
  steps: number;
  heartRate: {
    average: number;
    min: number;
    max: number;
  };
  calories: number;
  activeMinutes: number;
  sleep: {
    durationMinutes: number;
    efficiency: number;
  };
}

const GOOGLE_FIT_API_BASE = 'https://www.googleapis.com/fitness/v1/users/';

export async function fetchFitnessData(
  accessToken: string,
  startDate: Date = subDays(new Date(), 7),
  endDate: Date = new Date()
): Promise<FitnessData> {
  const startTime = startOfDay(startDate).getTime();
  const endTime = endOfDay(endDate).getTime();

  const datasetRequest = {
    aggregateBy: [
      {
        dataTypeName: 'com.google.step_count.delta',
      },
      {
        dataTypeName: 'com.google.heart_rate.bpm',
      },
      {
        dataTypeName: 'com.google.calories.expended',
      },
      {
        dataTypeName: 'com.google.active_minutes',
      },
      {
        dataTypeName: 'com.google.sleep.segment',
      },
    ],
    bucketByTime: { durationMillis: 86400000 }, // Daily buckets
    startTimeMillis: startTime,
    endTimeMillis: endTime,
  };

  try {
    const response = await fetch(`${GOOGLE_FIT_API_BASE}/dataset:aggregate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datasetRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fitness data');
    }

    const data = await response.json();
    return processFitnessData(data);
  } catch (error) {
    console.error('Error fetching fitness data:', error);
    throw error;
  }
}

function processFitnessData(rawData: any): FitnessData {
  // Initialize with default values
  const processedData: FitnessData = {
    steps: 0,
    heartRate: {
      average: 0,
      min: 0,
      max: 0,
    },
    calories: 0,
    activeMinutes: 0,
    sleep: {
      durationMinutes: 0,
      efficiency: 0,
    },
  };

  // Process each bucket of data
  rawData.bucket.forEach((bucket: any) => {
    bucket.dataset.forEach((dataset: any) => {
      const dataType = dataset.dataSourceId;
      const points = dataset.point || [];

      if (dataType.includes('step_count')) {
        processedData.steps = sumDataPoints(points, 'steps');
      } else if (dataType.includes('heart_rate')) {
        const heartRates = getHeartRateStats(points);
        processedData.heartRate = heartRates;
      } else if (dataType.includes('calories')) {
        processedData.calories = sumDataPoints(points, 'calories');
      } else if (dataType.includes('active_minutes')) {
        processedData.activeMinutes = sumDataPoints(points, 'activity');
      } else if (dataType.includes('sleep')) {
        const sleepData = processSleepData(points);
        processedData.sleep = sleepData;
      }
    });
  });

  return processedData;
}

function sumDataPoints(points: any[], type: string): number {
  return points.reduce((sum: number, point: any) => {
    const value = point.value[0].intVal || point.value[0].fpVal || 0;
    return sum + value;
  }, 0);
}

function getHeartRateStats(points: any[]) {
  const heartRates = points.map((point: any) => point.value[0].fpVal || 0);
  return {
    average: Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length),
    min: Math.min(...heartRates),
    max: Math.max(...heartRates),
  };
}

function processSleepData(points: any[]) {
  const totalMinutes = points.reduce((total: number, point: any) => {
    const startTime = point.startTimeNanos / 1000000;
    const endTime = point.endTimeNanos / 1000000;
    return total + (endTime - startTime) / 60000;
  }, 0);

  return {
    durationMinutes: Math.round(totalMinutes),
    efficiency: calculateSleepEfficiency(points),
  };
}

function calculateSleepEfficiency(points: any[]) {
  const deepSleepMinutes = points.reduce((total: number, point: any) => {
    if (point.value[0].intVal === 4) { // Deep sleep stage
      const duration = (point.endTimeNanos - point.startTimeNanos) / 60000000000;
      return total + duration;
    }
    return total;
  }, 0);

  const totalMinutes = points.reduce((total: number, point: any) => {
    const duration = (point.endTimeNanos - point.startTimeNanos) / 60000000000;
    return total + duration;
  }, 0);

  return Math.round((deepSleepMinutes / totalMinutes) * 100);
}