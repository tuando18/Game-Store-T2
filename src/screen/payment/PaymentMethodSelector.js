import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const PaymentMethodSelector = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => {
    return (
        <View style={styles.paymentMethods}>
            <TouchableOpacity
                style={styles.paymentMethod}
                onPress={() => setSelectedPaymentMethod('paypal')}
            >
                <View style={styles.paymentMethodContent}>
                    <Image source={require('../../../assets/paypal.png')} style={styles.icon} />
                    <View>
                        <Text>Paypal</Text>
                        <Text>Checked automatically</Text>
                    </View>
                    {selectedPaymentMethod === 'paypal' && (
                        <View style={styles.circleSelected}>
                            <Image source={require('../../../assets/checkmark.png')} style={styles.checkmark} />
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.paymentMethod}
                onPress={() => setSelectedPaymentMethod('stripe')}
            >
                <View style={styles.paymentMethodContent}>
                    <Image source={require('../../../assets/stripe.png')} style={styles.icon} />
                    <View>
                        <Text>Stripe</Text>
                        <Text>Master Card, Visa...</Text>
                    </View>
                    {selectedPaymentMethod === 'stripe' && (
                        <View style={styles.circleSelected}>
                            <Image source={require('../../../assets/checkmark.png')} style={styles.checkmark} />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    paymentMethods: {
        flexDirection: 'column',
        width: '100%',
        marginBottom: 16,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginVertical: 8,
        position: 'relative',
    },
    paymentMethodContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        width: 32,
        height: 32,
        marginRight: 16,
    },
    circleSelected: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 16,
    },
    checkmark: {
        width: 16,
        height: 16,
        tintColor: 'white',
    },
});

export default PaymentMethodSelector;
