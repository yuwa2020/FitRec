// ActivityTracker.js
import { useEffect, useState } from 'react';
import { Pedometer, Barometer } from 'expo-sensors';
import { auth, firestore } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import { requestActivityPermissions } from '../utils/Permissions';

const AVERAGE_STAIR_HEIGHT = 3.3; // Average height of a flight of stairs in meters

export default function ActivityTracker({ onUpdate }) {
  const [stepCount, setStepCount] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);

  useEffect(() => {
    const initializeTracking = async () => {
      const hasPermission = await requestActivityPermissions();
      if (hasPermission) {
        startTracking();
        console.log("Tracking has successfully begun");
      } else {
        console.warn("Activity permissions are required for tracking.");
      }
    };
    initializeTracking();
  }, []);

  const startTracking = () => {
    Pedometer.watchStepCount(result => {
      setStepCount(prev => prev + result.steps);
      if (result.steps > 0) {
        setActiveMinutes(prev => prev + 1);
      }
      saveActivityData();
    });

    let previousPressure = null;
    Barometer.addListener(data => {
      if (previousPressure !== null && data.pressure > previousPressure) {
        const elevationChange = (data.pressure - previousPressure) * 8.3;
        setElevationGain(prev => prev + elevationChange);
      }
      previousPressure = data.pressure;
      saveActivityData();
    });
  };

  const saveActivityData = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const date = dayjs().format('YYYY-MM-DD');
    const weekStart = dayjs().startOf('week').format('YYYY-MM-DD');
    const userRef = doc(firestore, 'users', currentUser.uid, 'activity', date);
    const weeklyRef = doc(firestore, 'users', currentUser.uid, 'activity', 'weekly_summary');

    const flightsOfStairs = Math.floor(elevationGain / AVERAGE_STAIR_HEIGHT);

    const dailyData = {
      stepCount,
      flightsOfStairs,
      activeMinutes,
      timestamp: dayjs().toISOString(),
    };

    try {
      // Save daily data
      await setDoc(userRef, dailyData, { merge: true });

      // Update weekly summary
      await updateDoc(weeklyRef, {
        [`weeklySteps.${weekStart}`]: stepCount,
        [`weeklyFlights.${weekStart}`]: flightsOfStairs,
        [`weeklyActiveMinutes.${weekStart}`]: activeMinutes,
      });
    } catch (error) {
      console.error("Error saving activity data:", error);
    }

    // Pass updated data to the parent component
    onUpdate && onUpdate(dailyData);
  };

  return null;
}
