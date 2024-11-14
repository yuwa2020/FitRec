import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Pedometer, Barometer } from 'expo-sensors';
import { auth, firestore } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { requestActivityPermissions } from '../utils/permissions';

import dayjs from 'dayjs';

const AVERAGE_STAIR_HEIGHT = 3.3; // Average height of a flight of stairs in meters

export default function ActivityTracker() {
  const [stepCount, setStepCount] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Request necessary permissions on component mount
    const initializePermissions = async () => {
      const hasPermission = await requestActivityPermissions();
      if (!hasPermission) {
        Alert.alert("Permissions Needed", "Tracking requires additional permissions to function.");
      } else {
        setIsTracking(true); // Start tracking automatically once permissions are granted
      }
    };
    initializePermissions();
  }, []);

  useEffect(() => {
    let stepSubscription;
    let barometerSubscription;
    let previousPressure = null;

    if (isTracking) {
      // Track steps
      stepSubscription = Pedometer.watchStepCount(result => {
        setStepCount(prev => prev + result.steps);
        if (result.steps > 0) {
          setActiveMinutes(prev => prev + 1); // Assume each step activity increases active minutes
        }
      });

      // Track elevation
      barometerSubscription = Barometer.addListener(data => {
        if (previousPressure !== null && data.pressure > previousPressure) {
          const elevationChange = (data.pressure - previousPressure) * 8.3; // Approximate meters per hPa change
          setElevationGain(prev => prev + elevationChange);
        }
        previousPressure = data.pressure;
      });
    }

    return () => {
      if (stepSubscription) stepSubscription.remove();
      if (barometerSubscription) barometerSubscription.remove();
    };
  }, [isTracking]);

  const flightsOfStairs = Math.floor(elevationGain / AVERAGE_STAIR_HEIGHT);

  // Function to save daily and weekly data to Firestore
  const saveActivityData = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const date = dayjs().format('YYYY-MM-DD');
    const weekStart = dayjs().startOf('week').format('YYYY-MM-DD');
    const userRef = doc(firestore, 'users', currentUser.uid, 'activity', date);
    const weeklyRef = doc(firestore, 'users', currentUser.uid, 'activity', 'weekly_summary');

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

      Alert.alert("Data Saved", "Your activity data has been saved.");
    } catch (error) {
      console.error("Error saving activity data:", error);
      Alert.alert("Error", "Failed to save activity data.");
    }
  };

  return (
    <View>
      <Text>Daily Steps: {stepCount}</Text>
      <Text>Daily Flights of Stairs: {flightsOfStairs}</Text>
      <Text>Daily Active Minutes: {activeMinutes}</Text>
      <Button title="Save Activity Data" onPress={saveActivityData} />
    </View>
  );
}
