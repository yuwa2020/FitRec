import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { doc, getDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const recommendationBank = {
  lowBmiBeginner: [
    "Walk 3,000 steps today.",
    "Drink a protein smoothie after lunch.",
    "Stretch for 5 minutes in the morning.",
    "Eat a nutrient-dense snack like nuts or avocado.",
    "Do 10 minutes of light yoga before bed.",
    "Take a 15-minute slow walk after dinner.",
    "Try a beginner's strength exercise like wall push-ups.",
    "Add an extra egg to your breakfast for protein.",
    "Drink 2 liters of water today.",
    "Write down your meals in a journal.",
    "Do 5 minutes of deep breathing exercises.",
    "Add a banana to your breakfast for extra energy.",
    "Try seated leg lifts while watching TV.",
    "Add a serving of whole grains to your lunch.",
    "Do light stretching for 10 minutes before bed.",
    "Take a short walk in the park today.",
    "Add a healthy fat like olive oil to your meal.",
    "Do arm circles for 2 minutes to loosen up.",
    "Eat a handful of nuts as a snack.",
    "Try 5 bodyweight squats today.",
    "Stand and stretch every hour while sitting.",
    "Add a colorful vegetable to your dinner.",
    "Do gentle neck stretches to relieve tension.",
    "Drink a glass of milk or plant-based alternative.",
    "Climb a flight of stairs slowly today.",
    "Add a slice of whole grain toast to your breakfast.",
    "Practice balance on one foot for 10 seconds.",
    "Add an avocado slice to your lunch.",
    "Walk up and down your hallway for 5 minutes.",
    "Include a lean protein in your dinner.",
    "Do 5 toe touches to increase flexibility.",
    "Stand up and march in place for 2 minutes.",
    "Try light ankle rotations for 1 minute.",
    "Add a small portion of fruit to your snack.",
    "Do seated stretches for your shoulders and arms.",
    "Take a slow-paced walk for 10 minutes.",
    "Eat a small handful of seeds for a snack.",
    "Do 5 minutes of meditation or mindfulness.",
    "Try 3 deep squats at your own pace.",
    "Drink a smoothie with a mix of greens and fruits.",
    "Do light stretching for your calves.",
    "Try 1-minute light jogging in place.",
    "Add a serving of fish or beans to your dinner.",
    "Do shoulder rolls for 1 minute to relieve stress.",
    "Take a 10-minute leisurely bike ride.",
    "Add a high-calorie but healthy item to your meal.",
    "Walk while listening to a podcast for 15 minutes.",
    "Try standing up and sitting down 10 times.",
    "Add chia seeds or flax seeds to your breakfast.",
    "Stretch your back and neck before sleeping.",
  ],
  highBmiBeginner: [
    "Walk 2,000 steps today.",
    "Drink a glass of water before each meal.",
    "Stretch your arms and legs for 5 minutes.",
    "Take a short 10-minute walk after breakfast.",
    "Try 3 seated leg raises while watching TV.",
    "Add a serving of fresh fruit to your diet.",
    "Do 5 slow arm raises while seated.",
    "Drink at least 8 glasses of water.",
    "Stand up and sit down 5 times for exercise.",
    "Take a 5-minute slow-paced walk around your home.",
    "Stretch your calves by standing on your toes.",
    "Replace one sugary snack with a piece of fruit.",
    "Take a 10-minute slow-paced walk after lunch.",
    "Try simple seated yoga poses for 5 minutes.",
    "Stand and do side leg raises 5 times per leg.",
    "Add a serving of vegetables to your dinner.",
    "March in place for 2 minutes today.",
    "Take 5 deep breaths to relieve stress.",
    "Do 3 wall push-ups for arm strength.",
    "Eat one meal with a focus on lean protein.",
    "Stretch your arms and shoulders for 5 minutes.",
    "Add a small salad to your dinner tonight.",
    "Do 5 minutes of meditation before sleeping.",
    "Practice standing on one foot for 5 seconds.",
    "Stretch your hamstrings by touching your toes.",
    "Replace one soda with a glass of water.",
    "Do 3 seated torso twists for flexibility.",
    "Walk around the block at your own pace.",
    "Stand and stretch your arms above your head.",
    "Replace one snack with a handful of nuts.",
    "Do 5 slow arm circles to loosen up.",
    "Try 5 seated knee raises for core engagement.",
    "Add a serving of whole grains to one meal.",
    "Practice slow neck stretches for 2 minutes.",
    "Walk around your room for 3 minutes.",
    "Do 2 slow chair squats today.",
    "Take a gentle 10-minute stretch break.",
    "Replace chips with a small bowl of veggies.",
    "Do 3 seated marches for light cardio.",
    "Walk in place while watching TV for 5 minutes.",
    "Stretch your back and shoulders before bed.",
    "Eat a light, healthy snack in the afternoon.",
    "Take 2 short walks of 5 minutes each today.",
    "Try drinking herbal tea instead of soda.",
    "Do 5 heel raises to strengthen your legs.",
    "Stand up every 30 minutes while working.",
    "Stretch your arms behind your back for 1 minute.",
    "Do 3 seated cat-cow stretches for flexibility.",
    "Try a 10-minute guided meditation for relaxation.",
  ],
  intermediate: [
    "Complete a 30-minute brisk walk today.",
    "Do 20 push-ups and 15 sit-ups.",
    "Try a 15-minute yoga session.",
    "Go for a 20-minute bike ride.",
    "Climb 5 flights of stairs today.",
    "Do a 10-minute guided meditation.",
    "Complete 20 bodyweight squats.",
    "Try a new healthy recipe for dinner.",
    "Stretch your hamstrings for 5 minutes.",
    "Do a 20-minute strength training session.",
    "Walk 7,000 steps today.",
    "Include 2 servings of vegetables in your meals.",
    "Try a 15-minute core workout.",
    "Practice deep breathing for 5 minutes.",
    "Do 15 jumping jacks every hour today.",
    "Complete a 1-mile jog at your own pace.",
    "Add a small salad to your lunch or dinner.",
    "Try 10 minutes of resistance band exercises.",
    "Replace one sugary drink with herbal tea.",
    "Practice balance on one foot for 30 seconds.",
    "Drink 2 liters of water throughout the day.",
    "Complete 2 sets of 10 walking lunges.",
    "Try a 20-minute low-impact aerobics workout.",
    "Do a 5-minute warm-up before your workout.",
    "Walk your pet for 20 minutes or more.",
    "Include a source of lean protein in each meal.",
    "Perform 3 sets of 12 bicep curls with weights.",
    "Take a relaxing 15-minute nature walk.",
    "Do 10 minutes of foam rolling or stretching.",
    "Complete a 15-minute beginner HIIT session.",
    "Replace one snack with a piece of fruit.",
    "Walk for 10 minutes after every meal.",
    "Do 2 minutes of high knees or running in place.",
    "Practice 5 minutes of mindful stretching.",
    "Try an easy 20-minute swim session.",
    "Take a 20-minute stroll during your lunch break.",
    "Do 10 reps of planks, holding for 20 seconds each.",
    "Add whole grains like quinoa or brown rice to a meal.",
    "Practice 15 minutes of tai chi or pilates.",
    "Jog for 10 minutes at a moderate pace.",
    "Complete 3 sets of 15 calf raises.",
    "Do 10 minutes of stair climbing or step-ups.",
    "Stretch your hip flexors for 5 minutes.",
    "Do 20 arm circles forward and backward.",
    "Replace a snack with a handful of almonds.",
    "Try a new fruit or vegetable you’ve never had.",
    "Walk or bike to a nearby destination instead of driving.",
    "Perform a light 20-minute workout at home.",
    "Write down your fitness goals for the week.",
  ],
  advanced: [
    "Run 3 miles at your best pace.",
    "Complete a 45-minute strength training session.",
    "Try a 30-minute yoga flow for flexibility.",
    "Swim 20 laps at a steady pace.",
    "Do 50 push-ups throughout the day.",
    "Complete a 30-minute high-intensity interval training (HIIT) workout.",
    "Hike 3 miles on a moderate trail.",
    "Run 10,000 steps by the end of the day.",
    "Perform 4 sets of 15 squats with added weight.",
    "Do a 15-minute cool-down after your workout.",
    "Try a new advanced yoga pose.",
    "Cycle 15 miles at a moderate pace.",
    "Run a mile as fast as you can.",
    "Do 5 sets of 10 burpees with a 30-second rest.",
    "Complete a 30-minute advanced pilates session.",
    "Try a new sport like tennis or boxing.",
    "Do 3 sets of 20 mountain climbers.",
    "Swim continuously for 20 minutes.",
    "Jump rope for 5 minutes without stopping.",
    "Perform 3 sets of 15 deadlifts.",
    "Do 4 sets of 15 walking lunges with weights.",
    "Complete a 10-minute sprint interval session.",
    "Play a recreational game like basketball or soccer.",
    "Try a 20-minute spin class or cycling session.",
    "Do a 20-minute advanced core workout.",
    "Climb 15 flights of stairs throughout the day.",
    "Perform a 30-second plank hold every hour today.",
    "Run or jog for 30 minutes on a hilly route.",
    "Perform 4 sets of 20 kettlebell swings.",
    "Do 15 minutes of box jumps or step-ups.",
    "Try a 1-hour Zumba or dance class.",
    "Replace refined carbs with whole grains all day.",
    "Cycle or row for 30 minutes at high resistance.",
    "Try rock climbing or bouldering for 1 hour.",
    "Sprint for 30 seconds, then rest for 1 minute (repeat 8 times).",
    "Do 10 minutes of shadowboxing or kickboxing.",
    "Complete 100 squats throughout the day.",
    "Perform 4 sets of 15 tricep dips.",
    "Do 20 minutes of mobility drills or dynamic stretches.",
    "Go for a 5-mile jog at a steady pace.",
    "Perform 3 sets of pull-ups or assisted pull-ups.",
    "Try a 30-minute plyometric workout.",
    "Do 10 rounds of alternating sprint and jog intervals.",
    "Complete 4 sets of 12 leg presses at the gym.",
    "Add an extra 20 minutes to your regular workout.",
    "Replace all sugary drinks with water today.",
    "Play a sport like volleyball or racquetball for 1 hour.",
    "Perform a 20-minute stair climbing workout.",
    "Complete a 15-minute core strengthening session.",
    "Stretch every major muscle group for 10 minutes post-workout.",
  ],
};

const categorizeUser = (userData) => {
  const { bmi, age, activityLevel } = userData;

  if (bmi < 18.5) return 'lowBmiBeginner';
  if (bmi >= 18.5 && bmi <= 34) {
    if (age < 40 && activityLevel > 7) return 'advanced';
    return 'intermediate';
  }
  if (bmi > 34) return 'highBmiBeginner';

  return 'lowBmiBeginner'; // Default to beginner
};

const getRandomRecommendation = (profile) => {
  if (!recommendationBank[profile] || recommendationBank[profile].length === 0) {
    console.warn(`No recommendations found for profile: ${profile}`);
    return "Keep moving and stay motivated!";
  }

  const recommendations = recommendationBank[profile];
  const randomIndex = Math.floor(Math.random() * recommendations.length);
  return recommendations[randomIndex];
};

export default function RecommendationsScreen() {
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState('');
  const [currentRecommendation, setCurrentRecommendation] = useState('');
  const [oldRecommendations, setOldRecommendations] = useState([]);

  //screenheight
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userRef = doc(firestore, 'users', currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserData(userData);

            // Determine profile and fetch current recommendation
            const userProfile = categorizeUser(userData);
            setProfile(userProfile);

            fetchRecommendations(currentUser.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", "Could not load recommendations.");
        }
      }
    };

    fetchUserData();
  }, []);

  const fetchRecommendations = async (userId) => {
    try {
      const recommendationsRef = collection(firestore, 'users', userId, 'recommendations');
      const querySnapshot = await getDocs(recommendationsRef);
      const recommendations = [];
      querySnapshot.forEach((doc) => {
        recommendations.push({ id: doc.id, ...doc.data() });
      });

      recommendations.sort((a, b) => b.date - a.date); // Sort by most recent
      if (recommendations.length > 0) {
        setCurrentRecommendation(recommendations[0].text); // Most recent as current
      }
      setOldRecommendations(recommendations.slice(1)); // Remaining as old
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const generateNewRecommendation = async () => {
    if (!profile) {
      console.error("No profile available to generate a recommendation.");
      Alert.alert("Error", "Profile data is missing. Please try again.");
      return;
    }

    const newRecommendation = getRandomRecommendation(profile);

    if (!newRecommendation) {
      console.error("Failed to generate a new recommendation.");
      Alert.alert("Error", "Could not fetch a recommendation. Please try later.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No user is currently logged in.");
      Alert.alert("Error", "You must be logged in to receive recommendations.");
      return;
    }

    const recommendationsRef = collection(firestore, 'users', currentUser.uid, 'recommendations');
    const recommendationData = {
      text: newRecommendation,
      profile,
      date: new Date().toISOString(),
    };

    try {
      await addDoc(recommendationsRef, recommendationData);
      setCurrentRecommendation(newRecommendation);
      setOldRecommendations((prev) => [recommendationData, ...prev]);
      console.log("New recommendation saved successfully.");
    } catch (error) {
      console.error("Error saving new recommendation:", error);
      Alert.alert("Error", "Could not generate a new recommendation.");
    }
  };


    //clear old recs
    const clearRecommendations = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
    
      const recommendationsRef = collection(firestore, 'users', currentUser.uid, 'recommendations');
      try {
        for (const rec of oldRecommendations) {
          if (!rec.id) {
            console.warn("Skipping invalid recommendation:", rec);
            continue; // Skip if ID is missing
          }
          const docRef = doc(recommendationsRef, rec.id);
          await deleteDoc(docRef);
        }
        setOldRecommendations([]);
        Alert.alert("Success", "All past recommendations have been cleared.");
      } catch (error) {
        console.error("Error clearing recommendations:", error);
        Alert.alert("Error", "Could not clear past recommendations.");
      }
    };
    

  return (
    <View style={styles.container}>
    {/* Pinned Recommendation Card */}
    <View style={styles.pinnedCard}>
      <FontAwesome6 name="lightbulb" size={40} color="#fff" style={styles.icon} />
      <View>
        <Text style={styles.recommendationLabel}>Today's Recommendation</Text>
        <Text style={styles.profileLabel}>Profile: {profile || "Determining..."}</Text>

        <Text style={styles.recommendationValue}>
          {currentRecommendation || "No recommendation yet"}
        </Text>
      </View>

      <TouchableOpacity style={styles.recommendationButton} onPress={generateNewRecommendation}>
        <Text style={styles.buttonText}>New Recommendation</Text>
      </TouchableOpacity>
    </View>

    {/* Scrollable Old Recommendations */}
    <View style={[styles.card, {height: screenHeight *0.445}]}>
        <Text style={styles.additionalRecommendationsLabel}>Past Recommendations</Text>
        <ScrollView style={styles.scrollableContent}>
          {oldRecommendations.length > 0 ? (
            oldRecommendations.map((rec) => (
              <View key={rec.id} style={styles.oldRecommendation}>
                <Text style={styles.recommendationItem}>{rec.text}</Text>
                <Text style={styles.dateLabel}>{new Date(rec.date).toLocaleDateString()}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.recommendationItem}>No past recommendations yet.</Text>
          )}

          {/*clear button here*/}
          <TouchableOpacity style={styles.clearButton} onPress={clearRecommendations}>
            <Text style={styles.clearButtonText}>Clear Past Recommendations</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>


  </View>
);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
  },
  pinnedCard: {
    backgroundColor: '#0077b6',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  icon: {
    marginBottom: 10,
  },
  recommendationLabel: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  recommendationValue: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 10,
    textAlign: "center",
    textAlignVertical: 'center',
    lineHeight: 24,
    height: 48,

  },
  profileLabel: {
    textAlign: "center",
    fontSize: 14,
    color: '#ddd',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  additionalRecommendationsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  oldRecommendation: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  recommendationItem: {
    fontSize: 14,
    color: '#555',
  },
  dateLabel: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
  recommendationButton: {
    backgroundColor: '#00316E', //dark blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 12,
    fontWeight: 'bold',
  },

  clearButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
