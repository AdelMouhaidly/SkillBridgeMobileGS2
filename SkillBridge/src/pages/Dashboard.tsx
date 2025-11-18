import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Briefcase, BookOpen, Sparkles, Target, ArrowRight } from 'lucide-react-native';
import { getUser, getVagas, getCursos, getRecomendacoesBasicas } from '../services/api';
import { User, RecomendacaoBasica, Curso, Vaga } from '../types';

export default function Dashboard({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ vagas: 0, cursos: 0 });
  const [recomendacoes, setRecomendacoes] = useState<RecomendacaoBasica | null>(null);
  const [loadingRecomendacoes, setLoadingRecomendacoes] = useState(false);
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

      // Carregar recomendações básicas automaticamente
      if (userData) {
        loadRecomendacoes(userData.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadRecomendacoes = async (usuarioId: string) => {
    setLoadingRecomendacoes(true);
    try {
      const data = await getRecomendacoesBasicas(usuarioId);
      setRecomendacoes(data);
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
      setRecomendacoes(null);
    } finally {
      setLoadingRecomendacoes(false);
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

      {/* Imagem Hero */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../images/imagem.jpeg")}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      {/* Introdução do App */}
      <View style={styles.introContainer}>
        <Text style={styles.introTitle}>Bem-vindo ao SkillBridge</Text>
        <Text style={styles.introText}>
          Conecte-se com oportunidades de carreira e desenvolva suas habilidades. 
          Encontre vagas personalizadas, cursos recomendados e crie um plano de estudos 
          adaptado ao seu perfil profissional.
        </Text>
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

      {/* Recomendações Básicas (Automáticas) */}
      <View style={styles.recomendacoesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recomendações para Você</Text>
        </View>
        {loadingRecomendacoes ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.loadingText}>Carregando recomendações...</Text>
          </View>
        ) : recomendacoes ? (
          <>
            {recomendacoes.cursos.length > 0 && (
              <View style={styles.recomendacaoCard}>
                <Text style={styles.recomendacaoTitle}>Cursos Recomendados</Text>
                {recomendacoes.cursos.slice(0, 3).map((curso: Curso) => (
                  <TouchableOpacity
                    key={curso.id}
                    style={styles.recomendacaoItem}
                    onPress={() => navigation.navigate('CursoDetalhes', { cursoId: curso.id })}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recomendacaoText} numberOfLines={1}>
                        {curso.nome || curso.titulo}
                      </Text>
                      <Text style={styles.recomendacaoSubtext} numberOfLines={1}>
                        {curso.area} • {curso.duracaoHoras || curso.carga_horaria || 0}h
                      </Text>
                    </View>
                    <ArrowRight size={16} color="#999" />
                  </TouchableOpacity>
                ))}
                {recomendacoes.cursos.length > 3 && (
                  <TouchableOpacity
                    style={styles.verMaisButton}
                    onPress={() => navigation.navigate('Recomendacoes')}
                  >
                    <Text style={styles.verMaisText}>Ver todas as recomendações</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {recomendacoes.vagas.length > 0 && (
              <View style={styles.recomendacaoCard}>
                <Text style={styles.recomendacaoTitle}>Vagas Recomendadas</Text>
                {recomendacoes.vagas.slice(0, 3).map((vaga: Vaga) => (
                  <TouchableOpacity
                    key={vaga.id}
                    style={styles.recomendacaoItem}
                    onPress={() => navigation.navigate('VagaDetalhes', { vagaId: vaga.id })}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recomendacaoText} numberOfLines={1}>
                        {vaga.titulo}
                      </Text>
                      <Text style={styles.recomendacaoSubtext} numberOfLines={1}>
                        {vaga.empresa} • {vaga.localidade}
                      </Text>
                    </View>
                    <ArrowRight size={16} color="#999" />
                  </TouchableOpacity>
                ))}
                {recomendacoes.vagas.length > 3 && (
                  <TouchableOpacity
                    style={styles.verMaisButton}
                    onPress={() => navigation.navigate('Recomendacoes')}
                  >
                    <Text style={styles.verMaisText}>Ver todas as recomendações</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        ) : null}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Recomendacoes')}
        >
          <Sparkles size={28} color="#FF9800" />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Recomendações</Text>
            <Text style={styles.actionDescription}>
              Veja recomendações personalizadas
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('PlanoEstudos')}
        >
          <Target size={28} color="#9C27B0" />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Plano de Estudos</Text>
            <Text style={styles.actionDescription}>
              Crie seu plano personalizado
            </Text>
          </View>
        </TouchableOpacity>

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
  imageContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  introContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 16,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  introText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
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
  recomendacoesSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
  },
  recomendacaoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  recomendacaoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  recomendacaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  recomendacaoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  recomendacaoSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  verMaisButton: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  verMaisText: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '500',
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
