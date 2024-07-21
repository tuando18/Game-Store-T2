import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, TextInput } from 'react-native';
import apiUrl from '../../../apiUrl';
import Ionicons from '@expo/vector-icons/Ionicons';

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
    setLoading(true); // Bắt đầu tải dữ liệu
    try {
      const response = await fetch(`${url_Product}?category=${categoryId}`);
      const responseText = await response.text();
      console.log("Response Text:", responseText); // Log response text
      const data = JSON.parse(responseText);
      console.log("Parsed Data:", data); // Log parsed data
      setProducts(data); // Cập nhật danh sách sản phẩm
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Dừng tải dữ liệu
    }
  };
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setFlatListKey((prevKey) => prevKey + 1);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
      <View key={item.id} style={styles.productContainer}>
        <Image source={{ uri: `http://${apiUrl.tuan}:3000${item.imageDescription}` }} style={styles.productImage} />
        <Text style={styles.productName}><Text style={{ fontWeight: '700' }}>Tên: </Text>{item.nameProduct}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
      </View>
    </TouchableOpacity>
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
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
        />
        <TouchableOpacity>
          <Ionicons name="search" size={20} color="white" style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <View>
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
      </View>
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
    marginTop: 5,
    backgroundColor: 'whitesmoke',
  },
  searchBarContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 180,
    paddingLeft: 15,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2, // For Android shadow
  },
  searchBar: {
    flex: 1,
    borderRadius: 180,
    height: 44,
  },
  searchIcon: {
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 180,
    marginLeft: 10,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2, // For Android shadow
  },
  categoryContainer: {
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2, // For Android shadow
    marginHorizontal: 10,
    borderRadius: 16,
    flexDirection: 'row',
    backgroundColor: '#fff',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: '#ddd',
  },
  categoryItem: {
    marginVertical: 15,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  categoryImage: {
    width: 55,
    height: 55,
    borderRadius: 16
  },
  categoryText: {
    marginTop: 5,
    color: "gray",
    fontSize: 14,
    fontWeight: '600'
  },
  selectedCategoryText: {
    color: 'orange',
  },
  productList: {
    flexDirection: 'column',
    marginTop: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    alignContent: 'center',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2, // For Android shadow
  },
  productImage: {
    borderRadius: 5,
    flex: 1,
    width: '100%',
    height: 190
  },
  productName: {
    paddingVertical: 10,
    marginTop: 10,
    fontSize: 16,
  },
  productPrice: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
