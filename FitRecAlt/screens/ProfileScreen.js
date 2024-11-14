import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, firestore } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Slider from '@react-native-community/slider';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: 5,
    dailyStepCount: '',
    goalStepCount: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load user data once on mount
  useEffect(() => {
    const loadData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(firestore, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No user data found, initializing profile data.");
        }
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        Alert.alert("Logged Out", "You have been logged out.");
        navigation.replace("SignIn");
      })
      .catch((error) => Alert.alert("Error", error.message));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsEditing(false);
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = doc(firestore, 'users', currentUser.uid);
      try {
        // Save only supported fields to Firestore
        const { firstName, lastName, age, weight, height, gender, activityLevel, dailyStepCount, goalStepCount } = userData;
        await setDoc(userRef, { firstName, lastName, age, weight, height, gender, activityLevel, dailyStepCount, goalStepCount }, { merge: true });
        Alert.alert("Profile Updated", "Your changes have been saved.");
      } catch (error) {
        console.error("Error saving profile data:", error);
        Alert.alert("Error", "Failed to save profile data.");
      }
    }
  };

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Rather not say'];

  const selectGender = (selectedGender) => {
    setUserData((prevData) => ({
      ...prevData,
      gender: selectedGender.toLower(),
    }));
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={toggleEdit} style={styles.editIcon}>
        <FontAwesome name="pencil" size={24} color="black" />
      </TouchableOpacity>

      {/* Default Profile Icon */}
      <View style={styles.profilePhotoContainer}>
        <FontAwesome name="user" size={80} color="#ccc" />
      </View>

      {/* Combined Display of First and Last Name */}
      <View style={styles.nameContainer}>
        <TextInput
          style={[styles.fullNameText, isEditing && styles.editableText]}
          value={userData.firstName}
          editable={isEditing}
          placeholder="First Name"
          onChangeText={(text) => setUserData({ ...userData, firstName: text })}
        />
        <TextInput
          style={[styles.fullNameText, isEditing && styles.editableText]}
          value={userData.lastName}
          editable={isEditing}
          placeholder="Last Name"
          onChangeText={(text) => setUserData({ ...userData, lastName: text })}
        />
      </View>

      {/* User Data Fields */}
      <View style={styles.profileData}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={userData.age}
          editable={isEditing}
          keyboardType="numeric"
          onChangeText={(text) => setUserData({ ...userData, age: text })}
        />

        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={styles.input}
          value={userData.weight}
          editable={isEditing}
          keyboardType="numeric"
          onChangeText={(text) => setUserData({ ...userData, weight: text })}
        />

        <Text style={styles.label}>Height (inches)</Text>
        <TextInput
          style={styles.input}
          value={userData.height}
          editable={isEditing}
          keyboardType="numeric"
          onChangeText={(text) => setUserData({ ...userData, height: text })}
        />

        {/* Gender Selection as Checkboxes */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.genderOption}
              onPress={() => selectGender(option)}
              disabled={!isEditing}
            >
              <FontAwesome
                name={userData.gender === option ? 'check-square' : 'square-o'}
                size={24}
                color={userData.gender === option ? '#000' : '#ccc'}
              />
              <Text style={styles.genderLabel}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity Level */}
        <Text style={styles.label}>Activity Level: {userData.activityLevel}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={userData.activityLevel}
          onValueChange={(value) => setUserData({ ...userData, activityLevel: value })}
          disabled={!isEditing}
        />

        <Text style={styles.label}>Daily Step Count</Text>
        <TextInput
          style={styles.input}
          value={userData.dailyStepCount}
          editable={isEditing}
          keyboardType="numeric"
          onChangeText={(text) => setUserData({ ...userData, dailyStepCount: text })}
        />

        <Text style={styles.label}>Goal Step Count</Text>
        <TextInput
          style={styles.input}
          value={userData.goalStepCount}
          editable={isEditing}
          keyboardType="numeric"
          onChangeText={(text) => setUserData({ ...userData, goalStepCount: text })}
        />
      </View>

      {isEditing && <Button title="Save Changes" onPress={handleSave} />}
      <View style={styles.logoutButtonContainer}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  profilePhotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  fullNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  editableText: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 2,
    fontSize: 18,
  },
  profileData: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  genderLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  logoutButtonContainer: {
    marginTop: 30,
    width: '100%',
  },
});
