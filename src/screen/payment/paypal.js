import React, { useEffect, useState } from 'react';
import { View, Modal, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const PayPal = ({ session, paypalVisible, setPaypalVisible, onPaymentSuccess, onPaymentCancel }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
    }, [session]);

    const handleNavigationStateChange = async (navState) => {
        const { url } = navState;
        if (url.includes('execute-payment')) {
            // Extract PayerID and PaymentID from URL
            const urlParams = new URLSearchParams(url.split('?')[1]);
            const payerId = urlParams.get('PayerID');
            const paymentId = urlParams.get('paymentId');
            if (payerId && paymentId) {
                await onPaymentSuccess(payerId, paymentId);
            }
        }
    };

    return (
        <Modal
            visible={paypalVisible}
            onRequestClose={() => setPaypalVisible(false)}
            animationType="slide"
        >
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: session }}
                    onNavigationStateChange={handleNavigationStateChange}
                    onLoadEnd={() => setLoading(false)}
                    startInLoadingState
                    renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
                />
                {loading && <ActivityIndicator size="large" color="#0000ff" style={{ position: 'absolute', top: '50%', left: '50%' }} />}
            </View>
        </Modal>
    );
};

export default PayPal;
