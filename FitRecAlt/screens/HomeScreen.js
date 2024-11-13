import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import UserInfoModal from '../components/UserInfoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [age, setAge] = useState(''); // State for user input 1
  const [gender, setGender] = useState(''); // State for user input 2
  const [height, setHeight] = useState(''); // State for user input 3
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
        body: JSON.stringify({ age: age, gender: gender, bmi: height }), // Change 'height' to 'bmi'
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