import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BookOpen, Clock, ArrowLeft, Tag, GraduationCap, Layers } from 'lucide-react-native';
import { getCursoById } from '../services/api';
import { Curso } from '../types';

export default function CursoDetalhes({ route, navigation }: any) {
  const { cursoId } = route.params;
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurso();
  }, [cursoId]);

  const loadCurso = async () => {
    try {
      const data = await getCursoById(cursoId);
      setCurso(data);
    } catch (error) {
      console.error('Erro ao carregar curso:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!curso) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Curso não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Curso</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <BookOpen size={32} color="#4CAF50" />
            <View style={styles.cardHeaderText}>
              <Text style={styles.titulo}>{curso.nome || curso.titulo}</Text>
              {curso.instituicao && (
                <Text style={styles.instrutor}>{curso.instituicao}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Layers size={20} color="#666" />
              <Text style={styles.infoText}>{curso.area}</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={20} color="#666" />
              <Text style={styles.infoText}>{curso.duracaoHoras || curso.carga_horaria || 0} horas</Text>
            </View>
            <View style={styles.infoRow}>
              <GraduationCap size={20} color="#666" />
              <Text style={styles.infoText}>{curso.modalidade}</Text>
            </View>
            {curso.nivel && (
              <View style={styles.infoRow}>
                <Tag size={20} color="#666" />
                <Text style={styles.infoText}>Nível: {curso.nivel}</Text>
              </View>
            )}
          </View>

          {curso.competencias && curso.competencias.length > 0 && (
            <View style={styles.competenciasSection}>
              <Text style={styles.sectionTitle}>Competências Desenvolvidas</Text>
              <View style={styles.competenciasContainer}>
                {curso.competencias.map((comp, idx) => (
                  <View key={idx} style={styles.competenciaTag}>
                    <Tag size={14} color="#4CAF50" />
                    <Text style={styles.competenciaText}>{comp}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.descricaoSection}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.descricao}>{curso.descricao}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
  },
  cardHeaderText: {
    flex: 1,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  instrutor: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  infoSection: {
    gap: 12,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
  },
  competenciasSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  competenciasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  competenciaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  competenciaText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  descricaoSection: {
    marginBottom: 10,
  },
  descricao: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
});

