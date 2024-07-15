import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import HomeScreen from '../screen/home';
import CategoryScreen from '../screen/category';
import FavoriteScreen from '../screen/favorite';
import ProfileScreen from '../screen/profile';
import ProductDetailsScreen from '../screen/productDetails';
import ProductDetailScreen from '../screen/productDetails';

const Tab = createBottomTabNavigator();

const MainScreen = ({ navigation }) => {
  const route = useRoute();
  const { nameUserSend } = route.params || {};

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerTitle: () => (
          <Text style={{fontSize: 18, fontWeight: '700', color: 'gray'}}>Game Store T2</Text>
        ),
        headerRight: () => (
          <TouchableOpacity>
            <Ionicons name="notifications" size={25} color="gray" style={{ marginRight: 15 }} />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorite') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Category') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={null}
    >
      <Tab.Screen name="Home" initialParams={{ nameUserSend: nameUserSend }} component={HomeScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Favorite" component={FavoriteScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />

      {/* Màn Hình */}
      <Tab.Screen name="ProductDetail" component={ProductDetailScreen} options={{ tabBarButton: () => null, headerShown: false, tabBarVisible: false }} />
    </Tab.Navigator>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
