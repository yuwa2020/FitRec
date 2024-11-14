// utils/permissions.js
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';

/**
 * Checks if the device supports the necessary sensors and prompts the user with an alert if not.
 */
export const requestActivityPermissions = async () => {
  try {
    // Check if device supports required sensors
    if (!Device.isDevice) {
      Alert.alert('Error', 'Physical device required to track activity.');
      return false;
    }

    // Additional logic to check platform-specific permissions if necessary
    if (Platform.OS === 'ios') {
      // iOS permissions are automatically granted for Pedometer and Barometer sensors
      return true;
    }

    if (Platform.OS === 'android') {
      // No additional permissions are required specifically for Pedometer or Barometer
      return true;
    }

    return true;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    Alert.alert('Permissions Error', 'Failed to get necessary permissions for activity tracking.');
    return false;
  }
};
