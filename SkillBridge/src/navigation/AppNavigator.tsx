import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import { Home, Briefcase, BookOpen, User, Sparkles, Target } from 'lucide-react-native';
import { isAuthenticated } from '../services/api';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Vagas from '../pages/Vagas';
import Cursos from '../pages/Cursos';
import Perfil from '../pages/Perfil';
import Recomendacoes from '../pages/Recomendacoes';
import PlanoEstudos from '../pages/PlanoEstudos';
import VagaDetalhes from '../pages/VagaDetalhes';
import CursoDetalhes from '../pages/CursoDetalhes';
import MinhasAplicacoes from '../pages/MinhasAplicacoes';
import AplicacaoDetalhes from '../pages/AplicacaoDetalhes';
import Sobre from '../pages/Sobre';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ onLogout, navigation }: any) {
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
        options={{ 
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />
        }}
      >
        {() => <Dashboard navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Recomendacoes" 
        component={Recomendacoes}
        options={{ 
          title: 'Recomendações',
          tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />
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
        name="PlanoEstudos"
        options={{ 
          title: 'Plano',
          tabBarIcon: ({ color, size }) => <Target size={size} color={color} />
        }}
      >
        {() => <PlanoEstudos navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Perfil"
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />
        }}
      >
        {() => <Perfil onLogout={onLogout} navigation={navigation} />}
      </Tab.Screen>
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
          <>
            <Stack.Screen name="Main">
              {({ navigation }) => <MainTabs onLogout={handleLogout} navigation={navigation} />}
            </Stack.Screen>
            <Stack.Screen name="PlanoEstudos" component={PlanoEstudos} />
            <Stack.Screen name="VagaDetalhes" component={VagaDetalhes} />
            <Stack.Screen name="CursoDetalhes" component={CursoDetalhes} />
            <Stack.Screen name="MinhasAplicacoes" component={MinhasAplicacoes} />
            <Stack.Screen name="AplicacaoDetalhes" component={AplicacaoDetalhes} />
            <Stack.Screen name="Sobre" component={Sobre} />
          </>
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
