// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then((userCredential) => {
        console.log("Logged in with:", userCredential.user.email);
        navigation.navigate('MainUser');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>
      <Text style={styles.subtitle}>Sign in and let's get going</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 24
  },
  title: {
    fontSize: 26,
    marginBottom: 10,
    marginTop: 40,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    fontWeight: "bold"

  },
  input: {
    backgroundColor: "#ffffff",
    width: '100%',
    height: 54,
    borderColor: 'gray',
    marginBottom: 16,
    padding: 8,
    paddingLeft: 20,
    borderRadius: 16,
    fontSize: 16
  },
  button: {
    backgroundColor: '#120990',
    height: 54,
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold"
  },
  linkText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
