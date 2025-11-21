import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Briefcase, MapPin, DollarSign, CheckCircle, ArrowLeft, Tag, FileText, BriefcaseBusiness, Users, List } from 'lucide-react-native';
import { getVagaById, criarAplicacao, getUser, getAplicacoes } from '../services/api';
import { Vaga, User } from '../types';

export default function VagaDetalhes({ route, navigation }: any) {
  const { vagaId } = route.params;
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [aplicando, setAplicando] = useState(false);
  const [jaCandidatado, setJaCandidatado] = useState(false);

  useEffect(() => {
    loadData();
  }, [vagaId]);

  const loadData = async () => {
    try {
      const [vagaData, userData] = await Promise.all([
        getVagaById(vagaId),
        getUser(),
      ]);
      setVaga(vagaData);
      setUser(userData);
      
      if (userData) {
        const aplicacoes = await getAplicacoes();
        const candidatou = aplicacoes.some(app => app.vagaId === vagaId);
        setJaCandidatado(candidatou);
      }
    } catch (error: any) {
      console.error('Erro ao carregar vaga:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da vaga');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleCandidatar = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para se candidatar');
      return;
    }

    if (jaCandidatado) {
      Alert.alert(
        'Já Candidatado',
        'Você já se candidatou para esta vaga. Acesse "Minhas Candidaturas" para acompanhar o status.',
        [
          {
            text: 'Ver Minhas Candidaturas',
            onPress: () => {
              navigation.navigate('Main', { screen: 'Perfil' });
              setTimeout(() => {
                navigation.navigate('MinhasAplicacoes');
              }, 100);
            },
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Confirmar Candidatura',
      `Deseja se candidatar para a vaga "${vaga?.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Candidatar-se',
          onPress: async () => {
            setAplicando(true);
            try {
              await criarAplicacao({ vagaId: vagaId });
              setJaCandidatado(true);
              Alert.alert(
                'Sucesso',
                'Candidatura realizada com sucesso!',
                [
                  {
                    text: 'Ver Minhas Candidaturas',
                    onPress: () => {
                      navigation.navigate('Main', { screen: 'Perfil' });
                      setTimeout(() => {
                        navigation.navigate('MinhasAplicacoes');
                      }, 100);
                    },
                  },
                  {
                    text: 'OK',
                    style: 'cancel',
                  },
                ]
              );
            } catch (error: any) {
              let errorMsg = 'Erro ao realizar candidatura';
              if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
              } else if (error.message) {
                errorMsg = error.message;
              }
              Alert.alert('Erro', errorMsg);
            } finally {
              setAplicando(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!vaga) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Vaga não encontrada</Text>
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
        <Text style={styles.headerTitle}>Detalhes da Vaga</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Briefcase size={32} color="#2196F3" />
            <View style={styles.cardHeaderText}>
              <Text style={styles.titulo}>{vaga.titulo}</Text>
              <Text style={styles.empresa}>{vaga.empresa}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MapPin size={20} color="#666" />
              <Text style={styles.infoText}>{vaga.localidade}</Text>
            </View>
            {vaga.tipoContrato && (
              <View style={styles.infoRow}>
                <FileText size={20} color="#666" />
                <Text style={styles.infoText}>{vaga.tipoContrato}</Text>
              </View>
            )}
            {vaga.formatoTrabalho && (
              <View style={styles.infoRow}>
                <BriefcaseBusiness size={20} color="#666" />
                <Text style={styles.infoText}>{vaga.formatoTrabalho}</Text>
              </View>
            )}
            {vaga.nivelSenioridade && (
              <View style={styles.infoRow}>
                <Users size={20} color="#666" />
                <Text style={styles.infoText}>{vaga.nivelSenioridade}</Text>
              </View>
            )}
            {vaga.salario && (
              <View style={styles.infoRow}>
                <DollarSign size={20} color="#4CAF50" />
                <Text style={[styles.infoText, styles.salary]}>
                  {typeof vaga.salario === 'number' ? `R$ ${vaga.salario.toLocaleString('pt-BR')}` : vaga.salario}
                </Text>
              </View>
            )}
          </View>

          {vaga.requisitos && vaga.requisitos.length > 0 && (
            <View style={styles.competenciasSection}>
              <Text style={styles.sectionTitle}>Requisitos</Text>
              <View style={styles.competenciasContainer}>
                {vaga.requisitos.map((req, idx) => (
                  <View key={idx} style={styles.competenciaTag}>
                    <List size={14} color="#2196F3" />
                    <Text style={styles.competenciaText}>{req}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {vaga.competenciasRequeridas && vaga.competenciasRequeridas.length > 0 && (
            <View style={styles.competenciasSection}>
              <Text style={styles.sectionTitle}>Competências Requeridas</Text>
              <View style={styles.competenciasContainer}>
                {vaga.competenciasRequeridas.map((comp, idx) => (
                  <View key={idx} style={styles.competenciaTag}>
                    <Tag size={14} color="#2196F3" />
                    <Text style={styles.competenciaText}>{comp}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {vaga.responsabilidades && (
            <View style={styles.descricaoSection}>
              <Text style={styles.sectionTitle}>Responsabilidades</Text>
              <Text style={styles.descricao}>{vaga.responsabilidades}</Text>
            </View>
          )}

          {vaga.descricao && !vaga.responsabilidades && (
            <View style={styles.descricaoSection}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.descricao}>{vaga.descricao}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.candidatarButton, 
            (aplicando || jaCandidatado) && styles.candidatarButtonDisabled,
            jaCandidatado && styles.candidatarButtonJaCandidatado
          ]}
          onPress={handleCandidatar}
          disabled={aplicando}
        >
          {aplicando ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.candidatarButtonText}>Candidatando...</Text>
            </>
          ) : jaCandidatado ? (
            <>
              <CheckCircle size={20} color="#fff" />
              <Text style={styles.candidatarButtonText}>Já Candidatado</Text>
            </>
          ) : (
            <>
              <CheckCircle size={20} color="#fff" />
              <Text style={styles.candidatarButtonText}>Candidatar-se</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  empresa: {
    fontSize: 16,
    color: '#2196F3',
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
  salary: {
    color: '#4CAF50',
    fontWeight: '600',
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
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  competenciaText: {
    fontSize: 13,
    color: '#2196F3',
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
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  candidatarButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  candidatarButtonDisabled: {
    opacity: 0.6,
  },
  candidatarButtonJaCandidatado: {
    backgroundColor: '#2196F3',
  },
  candidatarButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

