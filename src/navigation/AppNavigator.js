// AppNavigator.js — Arquitectura de navegación
// Atribución IA (ver REFLEXION.md):
//   · IA: propuso la estructura de un BottomTab con dos Stacks
//     anidados (Home y Profile) para poder navegar al detalle
//     desde ambas pestañas.
//   · Yo: personalicé los headers (logo serif "Instagram", icono
//     add-square en el perfil) y los colores de la tab bar.

import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Stack del Home: Feed -> Detalle del post
function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Feed"
        component={HomeScreen}
        options={{
          headerTitle: () => <Text style={styles.logoText}>Instagram</Text>,
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: true,
        }}
      />
      <HomeStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          title: 'Publicación',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
          headerTitleStyle: { fontWeight: '600', fontSize: 16 },
        }}
      />
    </HomeStack.Navigator>
  );
}

// Stack del Perfil: Perfil -> Detalle del post (desde la grilla)
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          headerTitle: 'meow_lover',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
          headerShadowVisible: true,
          headerRight: () => (
            <Ionicons name="add-square-outline" size={24} color="#000" style={{ marginRight: 12 }} />
          ),
        }}
      />
      <ProfileStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          title: 'Publicación',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
          headerTitleStyle: { fontWeight: '600', fontSize: 16 },
        }}
      />
    </ProfileStack.Navigator>
  );
}

// Navegación principal: barra de pestañas inferior (Home / Perfil)
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Profile: focused ? 'person-circle' : 'person-circle-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#777',
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopColor: '#dbdbdb',
          borderTopWidth: 0.5,
          backgroundColor: '#fff',
          height: 50,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logoText: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },
});
