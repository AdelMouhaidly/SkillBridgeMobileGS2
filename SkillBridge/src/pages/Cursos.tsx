import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { BookOpen, Clock } from 'lucide-react-native';
import { getCursos } from '../services/api';
import { Curso } from '../types';

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCursos = async () => {
    try {
      const data = await getCursos();
      if (Array.isArray(data)) {
        setCursos(data);
      } else if (data?.content && Array.isArray(data.content)) {
        setCursos(data.content);
      } else {
        setCursos([]);
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Erro ao carregar cursos:', error);
      }
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCursos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCursos();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Cursos Disponíveis</Text>

      {cursos.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <BookOpen size={48} color="#ccc" />
          <Text style={styles.empty}>Nenhum curso encontrado</Text>
          <Text style={styles.emptySubtext}>
            Puxe para baixo para atualizar
          </Text>
        </View>
      ) : (
        cursos.map((curso) => (
          <View key={curso.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <BookOpen size={24} color="#4CAF50" />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{curso.titulo}</Text>
                <Text style={styles.instructor}>Por {curso.instrutor}</Text>
              </View>
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <Clock size={16} color="#666" />
                <Text style={styles.infoText}>{curso.carga_horaria}h</Text>
              </View>
            </View>

            <Text style={styles.description} numberOfLines={3}>
              {curso.descricao}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  instructor: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  cardInfo: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
