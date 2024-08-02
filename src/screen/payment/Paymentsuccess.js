import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const PaymentSuccess = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const product = route.params?.product;
    const user = getAuth().currentUser;
    const userId = user.uid;

    return (
        <View style={styles.container}>
            <Button 
                title="Chi tiết đơn hàng" 
                onPress={() => {
                    navigation.navigate('OrderDetail', { product });
                }} 
            />
            <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PaymentSuccess;
