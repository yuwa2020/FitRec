import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Dimensions } from 'react-native';
import UserInfoModal from '../components/UserInfoModal';
import { auth, firestore } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { LineChart } from 'react-native-chart-kit';
import intensityData from '../intensity_data.json'; // Adjust the path as needed

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    dailyStepCount: 0,
    goalStepCount: 10000,
    flightsOfStairs: 0,
    weeklyFlightsOfStairs: 0,
    activeMinutes: 0,
    weeklyActiveMinutes: 0,
  });
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [data, setData] = useState([]);

  // Check if the modal needs to be shown on first login
  useEffect(() => {
    const checkFirstLogin = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(firestore, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (!userData.isFirstTimeModalShown) {
            setIsModalVisible(true);
          }
        } else {
          await setDoc(userRef, { isFirstTimeModalShown: false }, { merge: true });
          setIsModalVisible(true);
        }
      }
    };
    // Load CSV data
    const loadData = () => {
      const filteredData = intensityData
        .filter((row) => parseInt(row.subj_id, 10) === 25)
        .map((row) => ({
          minute: parseInt(row.minute, 10),
          VM: parseFloat(row.VM),
        }));
      setData(filteredData);
    };

    checkFirstLogin();
    loadData();
  }, []);

  // Close the modal and mark as shown for this user
  const handleModalClose = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userRef, { isFirstTimeModalShown: true }, { merge: true });
    }
    setIsModalVisible(false);
  };

  // Load user activity data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(firestore, 'users', currentUser.uid, 'activity', 'daily_metrics');
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    loadUserData();
  }, []);

  const calculateStepPercentage = () => {
    const { dailyStepCount, goalStepCount } = userData;
    return goalStepCount > 0 ? ((dailyStepCount / goalStepCount) * 100).toFixed(1) : 0;
  };

  const chartData = {
    labels: data.map((d) => d.minute.toString()),
    datasets: [
      {
        data: data.map((d) => d.VM),
      },
    ],
  };


  return (
    <ScrollView style={styles.container}>
      <UserInfoModal visible={isModalVisible} onClose={handleModalClose} />

      {/* Daily Steps Card */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <FontAwesome6 name="person-walking" size={40} color="#333" style={styles.icon} />
          <View>
            <Text style={styles.metricLabel}>Daily Steps</Text>
            <Text style={styles.metricValue}>{userData.dailyStepCount}</Text>
            <Text style={styles.metricSubLabel}>
              {calculateStepPercentage()}% of Goal ({userData.goalStepCount} steps)
            </Text>
          </View>
        </View>
      </View>

      {/* Flights of Stairs Card */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <FontAwesome6 name="stairs" size={40} color="#333" style={styles.icon} />
          <View>
            <Text style={styles.metricLabel}>Flights of Stairs</Text>
            <Text style={styles.metricValue}>{userData.flightsOfStairs}</Text>
            <Text style={styles.metricSubLabel}>Climbed Today</Text>
            <Text style={styles.metricSubLabel}>
              {/*Put weekly steps here*/}
              Weekly Total: {userData.weeklyFlightsOfStairs} Flights
            </Text>
          </View>
        </View>
      </View>

      {/* Active Minutes Card */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <FontAwesome6 name="clock" size={40} color="#333" style={styles.icon} />
          <View>
            <Text style={styles.metricLabel}>Active Minutes</Text>
            <Text style={styles.metricValue}>{userData.activeMinutes}</Text>
            <Text style={styles.metricSubLabel}>Today</Text>
            <Text style={styles.metricSubLabel}>
              Weekly Total: {userData.weeklyActiveMinutes} Minutes
            </Text>
          </View>
        </View>
      </View>

      {/* Graph Card */}
      <View style={styles.card}>
      <Text style={styles.metricLabel}>Intensity Plot </Text>
        {data.length > 0 ? (
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 40} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black text
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black labels
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#0000ff', // Blue dots
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text>Loading data...</Text>
        )}
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 20,
  },
  metricLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 5,
  },
  metricSubLabel: {
    fontSize: 14,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    width: '80%',
    alignSelf: 'center',
  },
  predictionContent: {
    width: '100%',
    alignItems: 'center',
  },
});
