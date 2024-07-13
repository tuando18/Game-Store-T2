// Import các thư viện cần thiết
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import các màn hình bạn muốn hiển thị trong Bottom Navigation
import HomeScreen from '../screen/home';


// Tạo Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline'; // Thay đổi icon tùy theo màn hình
            } else if (route.name === 'Profile') {
              iconName = 'person-outline'; // Thay đổi icon tùy theo màn hình
            }

            return <Ionicons name={'home'} size={20} color={'#000'} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato', // Màu sắc của tab đang được chọn
          inactiveTintColor: 'gray', // Màu sắc của tab không được chọn
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
