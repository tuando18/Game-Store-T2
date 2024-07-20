import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { getAuth } from 'firebase/auth';
import apiUrl from '../../../apiUrl';

const FavoriteScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const user = getAuth().currentUser;
  const url_apiFavorite = `http://${apiUrl.tuan}:3000/favorites`;

  useEffect(() => {
    fetchFavorites();
  }, [url_apiFavorite, user]);

  const fetchFavorites = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`${url_apiFavorite}?userId=${user.uid}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.length > 0) {
        setFavorites(data[0].favorites || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      Alert.alert('Error', 'Failed to load favorites.');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchFavorites();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image
        source={{ uri: `http://${apiUrl.tuan}:3000${item.imageDescription}` }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nameProduct}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()} đ</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  listContent: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: 'red',
  },
});

export default FavoriteScreen;
