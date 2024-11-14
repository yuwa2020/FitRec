import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button } from 'react-native';
import UserInfoModal from '../components/UserInfoModal';
import { auth, firestore } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

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
    checkFirstLogin();
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

  // Prediction Function
  const getPrediction = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ age: age, gender: gender, bmi: height }),
      });
      const result = await response.json();
      setPredictionResult(result);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
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

      {/* Prediction Card */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.predictionContent}>
            <Text style={styles.metricLabel}>Step Prediction</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age"
              value={age}
              onChangeText={setAge}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter gender"
              value={gender}
              onChangeText={setGender}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter height"
              value={height}
              onChangeText={setHeight}
            />
            <Button title="Get Prediction" onPress={getPrediction} />
            {predictionResult && (
              <Text style={styles.metricSubLabel}>Prediction: {JSON.stringify(predictionResult)}</Text>
            )}
          </View>
        </View>
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
