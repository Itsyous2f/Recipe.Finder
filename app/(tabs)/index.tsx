// App.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Modal,
  ScrollView,
  Linking,
  useColorScheme,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

// Types
type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strSource: string;
};

export default function App() {
  const [theme, setTheme] = useState('dark');

  const [query, setQuery] = useState<string>('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    axios.get('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
      .then(res => {
        const cats = res.data.meals.map((c: { strCategory: string }) => c.strCategory);
        setCategories(['All', ...cats]);
      });
  }, []);

  const searchMeals = async () => {
    if (!query && selectedCategory === 'All') return;
    try {
      const baseURL = query
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;

      const res = await axios.get(baseURL);
      const mealData = res.data.meals || [];

      if (query && selectedCategory !== 'All') {
        const filtered = mealData.filter((m: Meal) => m.strCategory === selectedCategory);
        setMeals(filtered);
      } else {
        if (query) {
          setMeals(mealData);
        } else {
          const detailedMeals = await Promise.all(
            mealData.map(async (m: Meal) => {
              const detail = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`);
              return detail.data.meals[0];
            })
          );
          setMeals(detailedMeals);
        }
      }

      Keyboard.dismiss();
    } catch (err) {
      console.error('Failed to fetch meals:', err);
      setMeals([]);
    }
  };

  const openMealDetail = (meal: Meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const darkMode = theme === 'dark';
  const themedStyles = darkMode ? darkStyles : styles;

  const MealCard = ({ meal }: { meal: Meal }) => (
    <TouchableOpacity style={themedStyles.card} onPress={() => openMealDetail(meal)}>
      <Image source={{ uri: meal.strMealThumb }} style={themedStyles.image} />
      <View style={themedStyles.info}>
        <Text style={themedStyles.title}>{meal.strMeal}</Text>
        <Text style={themedStyles.category}>{meal.strCategory} • {meal.strArea}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={themedStyles.container}>
      <View style={{ paddingBottom: 100, marginHorizontal: 20 }}>
        <Text style={themedStyles.header}>Recipe Finder</Text>

        <View style={themedStyles.filterBox}>
          <TextInput
            placeholder="Search meals..."
            placeholderTextColor={darkMode ? '#aaa' : '#666'}
            value={query}
            onChangeText={setQuery}
            style={themedStyles.input}
          />
          <TouchableOpacity style={themedStyles.button} onPress={searchMeals}>
            <Text style={themedStyles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <View style={themedStyles.pickerWrapper}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={{ color: darkMode ? '#fff' : '#000' }}>
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => <MealCard meal={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <ScrollView style={themedStyles.modalContainer}>
            {selectedMeal && (
              <>
                <Image source={{ uri: selectedMeal.strMealThumb }} style={themedStyles.modalImage} />
                <View style={themedStyles.modalContent}>
                  <Text style={themedStyles.modalTitle}>{selectedMeal.strMeal}</Text>
                  <Text style={themedStyles.modalSubtitle}>{selectedMeal.strCategory} • {selectedMeal.strArea}</Text>
                  <Text style={themedStyles.modalInstructions}>{selectedMeal.strInstructions}</Text>
                  {selectedMeal.strSource && (
                    <TouchableOpacity style={themedStyles.linkBtn} onPress={() => Linking.openURL(selectedMeal.strSource)}>
                      <Text style={themedStyles.buttonText}>View Original Article</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={themedStyles.closeBtn} onPress={() => setModalVisible(false)}>
                    <Text style={themedStyles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#ff6f61',
  },
  filterBox: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalImage: {
    width: '100%',
    height: 250,
  },
  modalContent: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff6f61',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  modalInstructions: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  linkBtn: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});

const darkStyles = StyleSheet.create({
  ...styles,
  container: { ...styles.container, backgroundColor: '#121212' },
  header: { ...styles.header, color: '#FFAB91' },
  input: { ...styles.input, backgroundColor: '#1E1E1E', color: '#fff' },
  card: { ...styles.card, backgroundColor: '#1E1E1E' },
  title: { ...styles.title, color: '#fff' },
  category: { ...styles.category, color: '#aaa' },
  modalContainer: { ...styles.modalContainer, backgroundColor: '#121212' },
  modalTitle: { ...styles.modalTitle, color: '#FFAB91' },
  modalSubtitle: { ...styles.modalSubtitle, color: '#bbb' },
  modalInstructions: { ...styles.modalInstructions, color: '#eee' },
  pickerWrapper: { backgroundColor: '#1E1E1E', borderRadius: 8, marginBottom: 16 },
});