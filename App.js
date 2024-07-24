// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screen/login';
import RegisterScreen from './src/screen/signln';
import MainScreen from './src/navigation/mainContainer';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from './src/screen/payment';
import PaymentCancelled from './src/screen/payment/PaymentCancelled';
import PaymentSuccess from './src/screen/payment/Paymentsuccess';
import PayPal from './src/screen/payment/paypal';
import ProductDetailScreen from './src/screen/productDetails';

const STRIPE_KEY = 'pk_test_51PdEjqHuPTPg0KlaybyA3UntGpJH02ZPeKcgqNKBJYZhJj1amp2pAEM8E80d1eSh3Pipz1PtSgr4mYRCsKQeFECj00prHQssgc'
const Stack = createStackNavigator();

export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_KEY}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">

          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainUser" component={MainScreen} options={{ headerShown: false }} />

          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false }} />

          
          <Stack.Screen name="Paypal" component={PayPal} options={{ headerShown: false }} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PaymentCancelled" component={PaymentCancelled} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />

        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>

  );
}
