import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Briefcase, CheckCircle, XCircle, Clock, ArrowRight, Percent, ArrowLeft, Trash2 } from 'lucide-react-native';
import { getAplicacoes, deletarAplicacao } from '../services/api';
import { Aplicacao } from '../types';

export default function MinhasAplicacoes({ navigation }: any) {
  const [aplicacoes, setAplicacoes] = useState<Aplicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAplicacoes();
  }, []);

  const loadAplicacoes = async () => {
    try {
      const data = await getAplicacoes();
      setAplicacoes(data);
    } catch (error: any) {
      console.error('Erro ao carregar aplicações:', error);
      setAplicacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAplicacoes();
    setRefreshing(false);
  };

  const handleCancelarCandidatura = (aplicacao: Aplicacao) => {
    Alert.alert(
      'Cancelar Candidatura',
      `Deseja realmente cancelar sua candidatura para a vaga "${aplicacao.vaga?.titulo || 'esta vaga'}"?`,
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarAplicacao(aplicacao.id);
              Alert.alert('Sucesso', 'Candidatura cancelada com sucesso!');
              await loadAplicacoes();
            } catch (error: any) {
              let errorMsg = 'Erro ao cancelar candidatura';
              if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
              } else if (error.message) {
                errorMsg = error.message;
              }
              Alert.alert('Erro', errorMsg);
            }
          },
        },
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return <CheckCircle size={20} color="#4CAF50" />;
      case 'REJEITADA':
        return <XCircle size={20} color="#f44336" />;
      default:
        return <Clock size={20} color="#FF9800" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return 'Aprovada';
      case 'REJEITADA':
        return 'Rejeitada';
      default:
        return 'Em Análise';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return '#4CAF50';
      case 'REJEITADA':
        return '#f44336';
      default:
        return '#FF9800';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Minhas Candidaturas</Text>
        <Text style={styles.subtitle}>{aplicacoes.length} candidatura(s)</Text>
      </View>

      {aplicacoes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Briefcase size={48} color="#ccc" />
          <Text style={styles.emptyText}>Nenhuma candidatura encontrada</Text>
          <Text style={styles.emptySubtext}>
            Você ainda não se candidatou a nenhuma vaga
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Vagas')}
          >
            <Text style={styles.exploreButtonText}>Explorar Vagas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          {aplicacoes.map((aplicacao) => (
            <View key={aplicacao.id} style={styles.card}>
              <TouchableOpacity
                onPress={() => navigation.navigate('AplicacaoDetalhes', { aplicacaoId: aplicacao.id })}
              >
                <View style={styles.cardHeader}>
                  <Briefcase size={24} color="#2196F3" />
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.vagaTitulo}>
                      {aplicacao.vaga?.titulo || 'Vaga'}
                    </Text>
                    <Text style={styles.empresa}>
                      {aplicacao.vaga?.empresa || 'Empresa'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.statusContainer}>
                    {getStatusIcon(aplicacao.status)}
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(aplicacao.status) },
                      ]}
                    >
                      {getStatusText(aplicacao.status)}
                    </Text>
                  </View>

                  {aplicacao.pontuacaoCompatibilidade !== undefined && (
                    <View style={styles.compatibilidadeContainer}>
                      <Percent size={16} color="#2196F3" />
                      <Text style={styles.compatibilidadeText}>
                        {aplicacao.pontuacaoCompatibilidade}% de compatibilidade
                      </Text>
                    </View>
                  )}

                  {aplicacao.dataAplicacao && (
                    <Text style={styles.dataText}>
                      Candidatura em {new Date(aplicacao.dataAplicacao).toLocaleDateString('pt-BR')}
                    </Text>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.verDetalhes}>Ver detalhes</Text>
                  <ArrowRight size={16} color="#2196F3" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelarButton}
                onPress={() => handleCancelarCandidatura(aplicacao)}
              >
                <Trash2 size={18} color="#f44336" />
                <Text style={styles.cancelarButtonText}>Cancelar Candidatura</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
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
  header: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: '#2196F3',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
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
  exploreButton: {
    marginTop: 24,
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  vagaTitulo: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  empresa: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  cardInfo: {
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  compatibilidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compatibilidadeText: {
    fontSize: 13,
    color: '#666',
  },
  dataText: {
    fontSize: 12,
    color: '#999',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  verDetalhes: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  cancelarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  cancelarButtonText: {
    fontSize: 14,
    color: '#f44336',
    fontWeight: '600',
  },
});


