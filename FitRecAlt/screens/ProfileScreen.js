// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    weight: '',
    gender: '',
    activityLevel: 5,
    dailyStepCount: '',
    goalStepCount: '',
    profilePhoto: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) {
          setUserData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    loadData();
  }, []);

  const pickImage = async () => {
    if (!isEditing) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access the gallery is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (pickerResult && !pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const selectedImageUri = pickerResult.assets[0].uri;
      const updatedUserData = { ...userData, profilePhoto: selectedImageUri };
      setUserData(updatedUserData);

      try {
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
        console.log("Profile photo successfully updated and saved:", selectedImageUri);
      } catch (error) {
        console.error("Failed to save profile photo:", error);
        Alert.alert("Error", "Could not save profile photo.");
      }
    } else {
      Alert.alert("Image Selection Error", "No valid image was selected. Please try again.");
      console.warn("Image selection failed, pickerResult:", pickerResult);
    }
  };

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
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      Alert.alert("Profile Updated", "Your changes have been saved.");
    } catch (error) {
      Alert.alert("Error", "Failed to save profile data.");
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      {/* Edit Icon in Top Right */}
      <TouchableOpacity onPress={toggleEdit} style={styles.editIcon}>
        <FontAwesome name="pencil" size={24} color="black" />
      </TouchableOpacity>

      {/* Profile Photo */}
      <TouchableOpacity onPress={pickImage} disabled={!isEditing}>
        <View style={styles.profilePhotoContainer}>
          {userData.profilePhoto ? (
            <Image source={{ uri: userData.profilePhoto }} style={styles.profilePhoto} />
          ) : (
            <FontAwesome name="user" size={50} color="#ccc" />
          )}
        </View>
      </TouchableOpacity>

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

        <Text style={styles.label}>Gender</Text>
        <DropDownPicker
          open={isGenderOpen}
          value={userData.gender}
          items={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Non-binary', value: 'non-binary' },
            { label: 'Rather not say', value: 'rather-not-say' }
          ]}
          setOpen={setIsGenderOpen}
          setValue={(value) => setUserData({ ...userData, gender: value })}
          disabled={!isEditing}
          placeholder="Select Gender"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownStyle}
        />

        <View style={styles.activityLevelContainer}>
          <Text style={styles.label}>Activity Level</Text>
          <Text style={styles.activityLevelValue}>{userData.activityLevel}</Text>
        </View>
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
  profilePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
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
  activityLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  activityLevelValue: {
    fontSize: 16,
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
  logoutButtonContainer: {
    marginTop: 30,
    width: '100%',
  },
});
