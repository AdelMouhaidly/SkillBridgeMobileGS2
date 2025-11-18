import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Briefcase, BookOpen } from 'lucide-react-native';
import { getUser, getVagas, getCursos } from '../services/api';
import { User } from '../types';

export default function Dashboard({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ vagas: 0, cursos: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const userData = await getUser();
      setUser(userData);

      const [vagas, cursos] = await Promise.all([
        getVagas().catch(() => []),
        getCursos().catch(() => []),
      ]);

      setStats({
        vagas: vagas.length || 0,
        cursos: cursos.length || 0,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}!</Text>
        <Text style={styles.name}>{user?.nome || 'Usuário'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Briefcase size={30} color="#2196F3" />
          <Text style={styles.statNumber}>{stats.vagas}</Text>
          <Text style={styles.statLabel}>Vagas</Text>
        </View>
        <View style={styles.statCard}>
          <BookOpen size={30} color="#4CAF50" />
          <Text style={styles.statNumber}>{stats.cursos}</Text>
          <Text style={styles.statLabel}>Cursos</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Vagas')}
        >
          <Briefcase size={28} color="#2196F3" />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Vagas</Text>
            <Text style={styles.actionDescription}>
              Explore oportunidades disponíveis
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Cursos')}
        >
          <BookOpen size={28} color="#4CAF50" />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Cursos</Text>
            <Text style={styles.actionDescription}>
              Desenvolva novas habilidades
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: '#2196F3',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  greeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 18,
    borderRadius: 15,
    gap: 15,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#666',
  },
});
