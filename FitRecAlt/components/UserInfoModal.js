import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';
import { auth, firestore } from '../firebase';  // Import auth and firestore
import { doc, setDoc } from 'firebase/firestore';

export default function UserInfoModal({ visible, onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState(null);
  const [activityLevel, setActivityLevel] = useState(5);
  const [dailyStepCount, setDailyStepCount] = useState('');
  const [goalStepCount, setGoalStepCount] = useState('');
  const [isGenderOpen, setIsGenderOpen] = useState(false);

  const handleNumericInput = (input, setter) => {
    if (/^\d*$/.test(input)) {
      setter(input);
    }
  };

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userData = {
        firstName,
        lastName,
        age,
        weight,
        height,
        gender,
        activityLevel,
        dailyStepCount,
        goalStepCount,
      };

      try {
        // Save user data to Firestore under the user's `uid`
        const userRef = doc(firestore, 'users', currentUser.uid);
        await setDoc(userRef, userData, { merge: true });
        Alert.alert("Profile Updated", "Your data has been saved.");
        onClose(); // Close the modal after saving
      } catch (error) {
        console.error("Failed to save user data:", error);
        Alert.alert("Error", "Could not save your data.");
      }
    } else {
      Alert.alert("Error", "No user is currently signed in.");
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

          <View style={styles.weightContainer}>
            <TextInput
              style={[styles.input, styles.weightInput]}
              placeholder="Weight"
              keyboardType="numeric"
              value={weight}
              onChangeText={(value) => handleNumericInput(value, setWeight)}
            />
            <Text style={styles.unitLabel}>lbs</Text>
          </View>

          <View style={styles.weightContainer}>
            <TextInput
              style={[styles.input, styles.weightInput]}
              placeholder="Height"
              keyboardType="numeric"
              value={height}
              onChangeText={(value) => handleNumericInput(value, setHeight)}
            />
            <Text style={styles.unitLabel}> inches </Text>
          </View>

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
  unitLabel: {
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
