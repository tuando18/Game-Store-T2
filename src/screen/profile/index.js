import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Button title="Lịch sử đơn hàng" onPress={() => navigation.navigate('OrderHistory')} />
    </View>
  )
}

const styles = StyleSheet.create({})