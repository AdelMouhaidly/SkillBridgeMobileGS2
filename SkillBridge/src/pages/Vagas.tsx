import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Briefcase, MapPin, DollarSign } from 'lucide-react-native';
import { getVagas } from '../services/api';
import { Vaga } from '../types';

export default function Vagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadVagas = async () => {
    try {
      const data = await getVagas();
      if (Array.isArray(data)) {
        setVagas(data);
      } else if (data?.content && Array.isArray(data.content)) {
        setVagas(data.content);
      } else {
        setVagas([]);
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Erro ao carregar vagas:', error);
      }
      setVagas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVagas();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVagas();
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
      <Text style={styles.title}>Vagas Disponíveis</Text>

      {vagas.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Briefcase size={48} color="#ccc" />
          <Text style={styles.empty}>Nenhuma vaga encontrada</Text>
          <Text style={styles.emptySubtext}>
            Puxe para baixo para atualizar
          </Text>
        </View>
      ) : (
        vagas.map((vaga) => (
          <View key={vaga.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Briefcase size={24} color="#2196F3" />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{vaga.titulo}</Text>
                <Text style={styles.company}>{vaga.empresa}</Text>
              </View>
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <MapPin size={16} color="#666" />
                <Text style={styles.infoText}>{vaga.localidade}</Text>
              </View>
              {vaga.salario && (
                <View style={styles.infoRow}>
                  <DollarSign size={16} color="#4CAF50" />
                  <Text style={[styles.infoText, styles.salary]}>{vaga.salario}</Text>
                </View>
              )}
            </View>

            <Text style={styles.description} numberOfLines={3}>
              {vaga.descricao}
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
  company: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  cardInfo: {
    gap: 6,
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
  salary: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
