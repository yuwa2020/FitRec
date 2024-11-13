import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import UserInfoModal from '../components/UserInfoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [feature1, setFeature1] = useState(''); // State for user input 1
  const [feature2, setFeature2] = useState(''); // State for user input 2
  const [predictionResult, setPredictionResult] = useState(null); // State to store model prediction

  useEffect(() => {
    AsyncStorage.getItem('isFirstTime').then(value => {
      if (value === null) {
        setIsModalVisible(true);
        AsyncStorage.setItem('isFirstTime', 'false');
      }
    });
  }, []);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsFirstTime(false); 
  };

  // Function to call the backend API
  const getPrediction = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feature1: feature1, feature2: feature2 }), // Send input data to API
      });
      const result = await response.json();
      setPredictionResult(result); // Store the prediction result in state
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <UserInfoModal visible={isModalVisible} onClose={handleModalClose} />

      {/* Input fields for features */}
      <TextInput
        style={styles.input}
        placeholder="Enter Feature 1"
        value={feature1}
        onChangeText={setFeature1}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Feature 2"
        value={feature2}
        onChangeText={setFeature2}
      />

      {/* Button to trigger prediction */}
      <Button title="Get Prediction" onPress={getPrediction} />

      {/* Display the prediction result */}
      {predictionResult && <Text>Prediction: {JSON.stringify(predictionResult)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    width: '80%',
  },
});