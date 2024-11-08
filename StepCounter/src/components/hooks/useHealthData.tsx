import {useEffect, useState} from 'react';
import AppleHealthKit, {HealthInputOptions, HealthKitPermissions, HealthUnit} from 'react-native-health';
import {Platform} from 'react-native';

const { Permissions } = AppleHealthKit.Constants;

const permissions: HealthKitPermissions = {
    permissions: {
      read: [
        Permissions.Steps,
        Permissions.FlightsClimbed,
        Permissions.DistanceWalkingRunning,
      ],
      write: [],
    },
  };


const useHealthData = () => {
    const [hasPermissions, setHasPermission] = useState(false);
    const [steps, setSteps] = useState(0);
    const [flights, setFlights] = useState(0);
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        if (Platform.OS != 'ios') {
            return;
        }
            AppleHealthKit.initHealthKit(permissions, (err) => {
            if (err) {
                console.log('Error getting permissions');
                return;
            }
            setHasPermission(true);
            });
        
        if(!hasPermissions) {
            return;
        }
        
        // Query Health data
        const options: HealthInputOptions = {
            date: new Date().toISOString(),
        };

        AppleHealthKit.getStepCount(options, (err, results) => {
            if (err) {
                console.log('Error getting step count');
                return;
            }
            setSteps(results.value);
        });

        AppleHealthKit.getFlightsClimbed(options, (err, results) => {
            if (err) {
                console.log('Error getting flights climbed', err);
                return;
            }
            setFlights(results.value);
        });

        AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
            if (err) {
                console.log('Error getting distance', err);
                return;
            }
            setDistance(results.value);
        });
        
    }, [hasPermissions]);

    // HealthKit implementation
    return {steps, flights, distance};
};

export default useHealthData;