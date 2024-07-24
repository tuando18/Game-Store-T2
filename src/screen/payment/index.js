import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { getAuth } from 'firebase/auth';
import apiUrl from '../../../apiUrl';
import PayPal from './paypal';
import PaymentMethodSelector from './PaymentMethodSelector';

const { width } = Dimensions.get('window');
const STRIPE_KEY = 'pk_test_51PdEjqHuPTPg0KlaybyA3UntGpJH02ZPeKcgqNKBJYZhJj1amp2pAEM8E80d1eSh3Pipz1PtSgr4mYRCsKQeFECj00prHQssgc';

const PaymentScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');
    const [paypalVisible, setPaypalVisible] = useState(false);
    const [paypalSession, setPaypalSession] = useState('');

    const product = route.params?.product || {};

    const handlePayment = async () => {
        setLoading(true);
        try {
            const amount = Math.floor(product.price);
            const user = getAuth().currentUser;
            const userId = user.uid;
    
            if (selectedPaymentMethod === 'stripe') {
                const response = await fetch(`http://${apiUrl.tuan}:3000/payments/intents`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount }),
                });
    
                const { paymentIntent } = await response.json();
    
                const { error } = await initPaymentSheet({
                    paymentIntentClientSecret: paymentIntent,
                    merchantDisplayName: 'Your App Name',
                });
    
                if (error) {
                    Alert.alert('Error', error.message);
                    setLoading(false);
                    return;
                }
    
                const { error: paymentError } = await presentPaymentSheet();
    
                if (paymentError) {
                    Alert.alert('Payment failed', paymentError.message);
                } else {
                    await moveToPayments(userId, product.id);
                    Alert.alert('Payment successful', 'Your payment was successful!');
                    navigation.navigate('PaymentSuccess');
                }
            } else if (selectedPaymentMethod === 'paypal') {
                const response = await fetch(`http://${apiUrl.tuan}:3000/api/paypal/create-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amountVND: product.price, productId: product.id, userId }),
                });
    
                const data = await response.json();
                console.log('PayPal response data:', data);
    
                if (data.approval_url) {
                    setPaypalSession(data.approval_url);
                    setPaypalVisible(true);
                } else {
                    Alert.alert('Error', 'Failed to create PayPal payment.');
                }
            }
        } catch (error) {
            console.error('Error during payment process:', error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handlePaymentSuccess = async (payerId, paymentId) => {
        try {
            const user = getAuth().currentUser;
            const userId = user.uid;
            const productId = product.id;
    
            const response = await fetch(`http://${apiUrl.tuan}:3000/api/paypal/execute-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ PayerID: payerId, paymentId: paymentId, productId, userId }),
            });
    
            if (!response.ok) {
                const data = await response.json();
                Alert.alert('Error', 'Payment execution failed. ' + data.error);
                setPaypalVisible(false);
                return;
            }
    
            Alert.alert('Payment successful', 'Your payment was successful!');
            setPaypalVisible(false);
            navigation.navigate('PaymentSuccess');
    
        } catch (error) {
            setPaypalVisible(false);
        }
    };

    const moveToPayments = async (userId, productId) => {
        try {
            const moveResponse = await fetch(`http://${apiUrl.tuan}:3000/payments/products/${productId}/move-to-payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!moveResponse.ok) {
                const errorData = await moveResponse.json();
                console.error('Error updating product status:', errorData.error);
                Alert.alert('Error', 'Payment succeeded, but there was an issue updating the product status.');
            }
        } catch (error) {
            console.error('Error during product status update:', error.message);
            Alert.alert('Error', 'An error occurred while updating the product status.');
        }
    };

    return (
        <StripeProvider publishableKey={STRIPE_KEY}>
            <View style={styles.container}>
                <Image
                    source={{ uri: `http://${apiUrl.tuan}:3000${product.imageDescription}` }}
                    style={styles.productImage}
                />
                <Text style={styles.productName}>Tên sản phẩm: {product.nameProduct}</Text>
                <Text style={styles.productPrice}>Giá: {product.price.toLocaleString()} đ</Text>
                <Text style={styles.productDescription}>Mô tả: {product.description || 'Không có mô tả'}</Text>

                <PaymentMethodSelector 
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                />

                <TouchableOpacity
                    style={styles.btnPay}
                    onPress={handlePayment}
                    disabled={loading}
                >
                    <Text style={styles.textPay}>Thanh toán</Text>
                </TouchableOpacity>

                <PayPal
                    session={paypalSession}
                    paypalVisible={paypalVisible}
                    setPaypalVisible={setPaypalVisible}
                    onPaymentSuccess={(payerId, paymentId) => handlePaymentSuccess(payerId, paymentId)}
                    onPaymentCancel={() => {
                        setPaypalVisible(false);
                        Alert.alert('Payment cancelled', 'The payment was cancelled.');
                    }}
                />
            </View>
        </StripeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    productImage: {
        width: width * 0.8,
        height: width * 0.8,
        marginBottom: 16,
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 18,
        marginBottom: 8,
    },
    productDescription: {
        fontSize: 16,
        marginBottom: 16,
    },
    btnPay: {
        backgroundColor: 'blue',
        padding: 16,
        borderRadius: 8,
    },
    textPay: {
        color: 'white',
        fontSize: 18,
    },
});

export default PaymentScreen;
