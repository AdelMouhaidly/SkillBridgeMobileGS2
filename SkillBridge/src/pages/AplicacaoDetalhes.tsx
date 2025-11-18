import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Briefcase, CheckCircle, XCircle, Clock, ArrowLeft, Percent, MessageSquare } from 'lucide-react-native';
import { getAplicacaoById } from '../services/api';
import { Aplicacao } from '../types';

export default function AplicacaoDetalhes({ route, navigation }: any) {
  const { aplicacaoId } = route.params;
  const [aplicacao, setAplicacao] = useState<Aplicacao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAplicacao();
  }, [aplicacaoId]);

  const loadAplicacao = async () => {
    try {
      const data = await getAplicacaoById(aplicacaoId);
      setAplicacao(data);
    } catch (error) {
      console.error('Erro ao carregar aplicação:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return <CheckCircle size={24} color="#4CAF50" />;
      case 'REJEITADA':
        return <XCircle size={24} color="#f44336" />;
      default:
        return <Clock size={24} color="#FF9800" />;
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

  if (!aplicacao) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Candidatura não encontrada</Text>
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
        <Text style={styles.headerTitle}>Detalhes da Candidatura</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.statusCard}>
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

          {aplicacao.vaga && (
            <>
              <View style={styles.vagaSection}>
                <View style={styles.vagaHeader}>
                  <Briefcase size={28} color="#2196F3" />
                  <View style={styles.vagaHeaderText}>
                    <Text style={styles.vagaTitulo}>{aplicacao.vaga.titulo}</Text>
                    <Text style={styles.empresa}>{aplicacao.vaga.empresa}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Informações da Vaga</Text>
                <Text style={styles.infoText}>{aplicacao.vaga.localidade}</Text>
                {aplicacao.vaga.salario && (
                  <Text style={styles.infoText}>{aplicacao.vaga.salario}</Text>
                )}
              </View>
            </>
          )}

          {aplicacao.pontuacaoCompatibilidade !== undefined && (
            <View style={styles.compatibilidadeCard}>
              <Percent size={24} color="#2196F3" />
              <View style={styles.compatibilidadeContent}>
                <Text style={styles.compatibilidadeLabel}>Compatibilidade</Text>
                <Text style={styles.compatibilidadeValue}>
                  {aplicacao.pontuacaoCompatibilidade}%
                </Text>
              </View>
            </View>
          )}

          {aplicacao.dataAplicacao && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Data da Candidatura</Text>
              <Text style={styles.infoText}>
                {new Date(aplicacao.dataAplicacao).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}

          {aplicacao.comentariosAvaliador && (
            <View style={styles.comentariosCard}>
              <MessageSquare size={20} color="#666" />
              <View style={styles.comentariosContent}>
                <Text style={styles.comentariosTitle}>Comentários do Avaliador</Text>
                <Text style={styles.comentariosText}>
                  {aplicacao.comentariosAvaliador}
                </Text>
              </View>
            </View>
          )}
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
    backgroundColor: '#2196F3',
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
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  vagaSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  vagaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  vagaHeaderText: {
    flex: 1,
  },
  vagaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  empresa: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  compatibilidadeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 16,
  },
  compatibilidadeContent: {
    flex: 1,
  },
  compatibilidadeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  compatibilidadeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  comentariosCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  comentariosContent: {
    flex: 1,
  },
  comentariosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  comentariosText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});


