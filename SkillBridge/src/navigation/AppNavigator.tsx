import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import { Home, Briefcase, BookOpen, User, Info } from 'lucide-react-native';
import { isAuthenticated } from '../services/api';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Vagas from '../pages/Vagas';
import Cursos from '../pages/Cursos';
import Perfil from '../pages/Perfil';
import Sobre from '../pages/Sobre';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ onLogout }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{ 
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Vagas" 
        component={Vagas}
        options={{ 
          title: 'Vagas',
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Cursos" 
        component={Cursos}
        options={{ 
          title: 'Cursos',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Perfil"
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />
        }}
      >
        {() => <Perfil onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Sobre" 
        component={Sobre}
        options={{ 
          title: 'Sobre',
          tabBarIcon: ({ color, size }) => <Info size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await isAuthenticated();
    setAuthenticated(isAuth);
    setLoading(false);
  };

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authenticated ? (
          <Stack.Screen name="Main">
            {() => <MainTabs onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <Login navigation={navigation} onLogin={handleLogin} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {({ navigation }) => (
                <Register navigation={navigation} onRegister={handleLogin} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
