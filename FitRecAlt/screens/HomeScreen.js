// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserInfoModal from '../components/UserInfoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [isFirstTime, setIsFirstTime] = useState(true); // Replace with actual check
  const [isModalVisible, setIsModalVisible] = useState(true);


  useEffect(() => {
    AsyncStorage.getItem('isFirstTime').then(value => {
      if (value === null) {
        setIsModalVisible(true);
        AsyncStorage.setItem('isFirstTime', 'false'); // Set after the first login
      }
    });
  }, []);


  // Set a flag to prevent showing the modal again
  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsFirstTime(false); 
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <UserInfoModal visible={isModalVisible} onClose={handleModalClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
