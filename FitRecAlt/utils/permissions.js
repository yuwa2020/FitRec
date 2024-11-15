// Permissions.js
import { Alert, Platform, PermissionsAndroid } from 'react-native';

/**
 * Requests necessary permissions for activity tracking.
 * iOS permissions are specified in app.json under NSMotionUsageDescription,
 * so only Android-specific permissions need to be requested here.
 * 
 * @returns {Promise<boolean>} True if permissions are granted, false otherwise.
 */
export async function requestActivityPermissions() {
  try {
    if (Platform.OS === 'android') {
      // Request Android activity recognition permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: "Activity Recognition Permission",
          message: "This app needs access to track your steps and activity.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Activity recognition permission granted on Android.");
        return true;
      } else {
        Alert.alert("Permission Denied", "Activity tracking requires this permission.");
        console.warn("Activity recognition permission denied on Android.");
        return false;
      }
    } else if (Platform.OS === 'ios') {
      // Permissions for iOS are managed via app.json configuration
      console.log("iOS permissions are managed via app.json.");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error requesting activity permissions:", error);
    Alert.alert("Error", "Unable to request activity permissions.");
    return false;
  }
}
