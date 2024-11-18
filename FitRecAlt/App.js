import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import RecommendationsScreen from './screens/RecommendationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import { auth, firestore } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  // Define updateUserData function within App component
  const updateUserData = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("No authenticated user.");
      return;
    }

    const userRef = doc(firestore, 'users', currentUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const updatedData = { ...data };

      // Calculate BMI if height and weight are available
      if (data.weight && data.height) {
        const heightInInches = parseFloat(data.height);
        const weightInLbs = parseFloat(data.weight);
        const bmi = parseFloat(((weightInLbs / (heightInInches * heightInInches)) * 703).toFixed(1));
        updatedData.bmi = bmi;
      }

      // Ensure all required fields have default values
      const defaultValues = {
        firstName: "",
        lastName: "",
        age: "",
        weight: "",
        height: "",
        gender: "",
        activityLevel: 5,
        dailyStepCount: 0,
        goalStepCount: 10000,
      };

      Object.keys(defaultValues).forEach((key) => {
        if (!updatedData[key]) updatedData[key] = defaultValues[key];
      });

      // Update Firestore if there are changes
      await setDoc(userRef, updatedData, { merge: true });
      console.log("User data updated in Firestore:", updatedData);
    } else {
      console.log("No user data found in Firestore.");
    }
  };

  // Effect to update user data when the app loads
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User authenticated:", user.uid);
        updateUserData(); // Update user data on login
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  function HomeTabs() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenListeners={{
          state: (e) => {
            const currentTab = e.data.state.routes[e.data.state.index];
            console.log("Switched to tab:", currentTab.name);
            if (auth.currentUser) {
              updateUserData(); // Trigger update when switching tabs
            }
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="Recommendations" component={RecommendationsScreen} options={{ title: 'Recommendations' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenListeners={{
          state: (e) => {
            const currentRoute = e.data.state.routes[e.data.state.index];
            console.log("Switched to route:", currentRoute.name);
            if (auth.currentUser) {
              updateUserData(); // Trigger update on screen switch
            }
          },
        }}
      >
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
