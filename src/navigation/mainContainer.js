import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import HomeScreen from '../screen/home';
import CategoryScreen from '../screen/category';
import FavoriteScreen from '../screen/favorite';
import ProfileScreen from '../screen/profile';
import ProductDetailScreen from '../screen/productDetails';
import PaymentScreen from '../screen/payment';
import OrderDetail from '../screen/orderDetails';
import OrderHistory from '../screen/orderHistory';

const Tab = createBottomTabNavigator();

const MainScreen = ({ navigation }) => {
  const route = useRoute();
  const { nameUserSend } = route.params || {};

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerTitle: () => (
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'gray' }}>Game Store T2</Text>
        ),
        headerRight: () => (
          <TouchableOpacity>
            <Ionicons name="notifications" size={25} color="gray" style={{ marginRight: 15 }} />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          const size = focused ? 22 : 20;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Category') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Favorite') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={[styles.tabContainer, focused && styles.tabContainerFocused]}>
              <Ionicons name={iconName} size={size} color={color} />
              {focused && (
                <Text style={[styles.tabLabel, { color: color }]}>
                  {route.name}
                </Text>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" initialParams={{ nameUserSend: nameUserSend }} component={HomeScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Favorite" component={FavoriteScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />

      <Tab.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          tabBarButton: () => null,
          tabBarVisible: false,
          headerShown: false,
        }}
      />

    </Tab.Navigator>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  tabContainerFocused: {
    backgroundColor: '#FFD18E',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F8EDE3',
  },
  tabLabel: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
  },
});
