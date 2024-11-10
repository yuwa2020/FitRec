// UserInfoModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserInfoModal({ visible, onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState(null);
  const [activityLevel, setActivityLevel] = useState(5);
  const [dailyStepCount, setDailyStepCount] = useState('');
  const [goalStepCount, setGoalStepCount] = useState('');

  const [isGenderOpen, setIsGenderOpen] = useState(false);

  // Function to handle numeric-only input
  const handleNumericInput = (input, setter) => {
    if (/^\d*$/.test(input)) {
      setter(input);
    }
  };

  // Save data and close modal
  const handleSave = async () => {
    const dataToSave = {
      firstName,
      lastName,
      age,
      weight,
      gender,
      activityLevel,
      dailyStepCount,
      goalStepCount,
    };

    try {
      await AsyncStorage.setItem('userData', JSON.stringify(dataToSave));
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Failed to save user data:", error);
      return; // return within function scope if needed for error handling
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Tell us about yourself</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={age}
            onChangeText={(value) => handleNumericInput(value, setAge)}
          />

          {/* Weight Input with "lbs" label */}
          <View style={styles.weightContainer}>
            <TextInput
              style={[styles.input, styles.weightInput]}
              placeholder="Weight"
              keyboardType="numeric"
              value={weight}
              onChangeText={(value) => handleNumericInput(value, setWeight)}
            />
            <Text style={styles.weightLabel}>lbs</Text>
          </View>

          {/* Gender Dropdown Menu */}
          <DropDownPicker
            open={isGenderOpen}
            value={gender}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Non-binary', value: 'non-binary' },
              { label: 'Rather not say', value: 'rather-not-say' }
            ]}
            setOpen={setIsGenderOpen}
            setValue={setGender}
            placeholder="Gender"
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownStyle}
          />

          <Text style={styles.label}>Activity Level: {activityLevel}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={activityLevel}
            onValueChange={setActivityLevel}
          />

          <TextInput
            style={styles.input}
            placeholder="Estimated Daily Step Count"
            keyboardType="numeric"
            value={dailyStepCount}
            onChangeText={(value) => handleNumericInput(value, setDailyStepCount)}
          />
          <TextInput
            style={styles.input}
            placeholder="Goal Step Count"
            keyboardType="numeric"
            value={goalStepCount}
            onChangeText={(value) => handleNumericInput(value, setGoalStepCount)}
          />

          <Button title="Save" onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightInput: {
    flex: 1,
  },
  weightLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  label: {
    marginVertical: 10,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  dropdownContainer: {
    marginVertical: 10,
    width: '100%',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownStyle: {
    maxHeight: 120,
  },
});
