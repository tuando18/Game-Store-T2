import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { getAuth } from 'firebase/auth';
import apiUrl from '../../../apiUrl';

const OrderHistory = ({ navigation }) => {
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const user = getAuth().currentUser;
    const orderApiUrl = `http://${apiUrl.tuan}:3000/orderhistory`;

    const fetchOrderData = async () => {
        try {
            setLoading(true);  // Start loading
            if (user) {
                const response = await fetch(`${orderApiUrl}?userId=${user.uid}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrderData(data.payments);
            } else {
                Alert.alert('Error', 'No user is currently logged in');
            }
        } catch (error) {
            console.error('Failed to fetch order data:', error);
            Alert.alert('Error', 'Failed to fetch order data');
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrderData();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchOrderData();
    }, [user]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => navigation.navigate('OrderDetail', { product: item })}
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
            <Text style={styles.title}>Order History</Text>
            <FlatList
                data={orderData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
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
    itemContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      marginBottom: 10,
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 3,
      padding: 10,
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
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
});

export default OrderHistory;
