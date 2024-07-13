import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import apiUrl from '../../../apiUrl';

const HomeScreen = ({ navigation }) => {
  const url_Category = `http://${apiUrl.tuan}:3000/category`;
  const url_Product = `http://${apiUrl.tuan}:3000/products`;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flatListKey, setFlatListKey] = useState(0);

  useEffect(() => {
    getDataCategoryfromAPI();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getDataProductfromAPI(selectedCategory);
    }
  }, [selectedCategory]);

  const getDataCategoryfromAPI = async () => {
    try {
      const response = await fetch(url_Category);
      const responseText = await response.text();
      console.log(responseText); // Log response
      const data = JSON.parse(responseText);
      setCategories(data);
      setSelectedCategory(data[0]?.id); // Automatically select the first category
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getDataProductfromAPI = async (categoryId) => {
    try {
      const response = await fetch(`${url_Product}?category=${categoryId}`);
      const responseText = await response.text();
      console.log(responseText); // Log response
      const data = JSON.parse(responseText);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setFlatListKey((prevKey) => prevKey + 1);
  };

  const renderProduct = ({ item }) => (
    <View key={item.id} style={styles.productContainer}>
      <Image source={{ uri: `http://${apiUrl.tuan}:3000${item.imageDescription}` }} style={styles.productImage} />
      <Text style={styles.productName}>{item.nameProduct}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity key={category.id} onPress={() => handleCategorySelect(category.id)}>
            <View style={styles.categoryItem}>
              <Image source={{ uri: `http://${apiUrl.tuan}:3000${category.imageCategory}` }} style={styles.categoryImage} />
              <Text style={[styles.categoryText, selectedCategory === category.id && styles.selectedCategoryText]}>
                {category.nameCategory}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        key={flatListKey}
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        style={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
  },
  categoryText: {
    fontSize: 16,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
    color: 'blue',
  },
  productList: {
    padding: 10,
  },
  productContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productName: {
    marginTop: 10,
    fontSize: 16,
  },
  productPrice: {
    marginTop: 5,
    fontSize: 14,
    color: 'green',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
