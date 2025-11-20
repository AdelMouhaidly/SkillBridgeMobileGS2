import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { getCursos } from '../services/api';
import { Curso } from '../types';

const { width } = Dimensions.get('window');

export default function Cursos({ navigation }: any) {
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
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerLogoContainer}>
          <Image
            source={require('../images/logoSkillBridge.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Cursos Disponíveis</Text>
      </View>

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
          <TouchableOpacity
            key={curso.id}
            style={styles.card}
            onPress={() => navigation?.navigate('CursoDetalhes', { cursoId: curso.id })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{curso.nome || curso.titulo}</Text>
                {curso.instituicao && (
                  <Text style={styles.instructor}>{curso.instituicao}</Text>
                )}
              </View>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.infoText}>{curso.area} •</Text>
              <Text style={styles.infoText}>{curso.duracaoHoras || curso.carga_horaria || 0}h •</Text>
              <Text style={styles.infoText}>{curso.modalidade}</Text>
              {curso.nivel && (
                <Text style={styles.infoText}> • Nível: {curso.nivel}</Text>
              )}
            </View>

            {curso.descricao && (
              <Text style={styles.description} numberOfLines={3}>
                {curso.descricao}
              </Text>
            )}
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerLogoContainer: {
    marginBottom: 12,
  },
  headerLogo: {
    width: width * 0.2,
    height: width * 0.2,
    maxWidth: 80,
    maxHeight: 80,
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
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
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 0,
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
    gap: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
