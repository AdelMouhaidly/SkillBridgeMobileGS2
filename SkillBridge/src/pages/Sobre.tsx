import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Zap, Code, CheckCircle } from 'lucide-react-native';

export default function Sobre() {
  const COMMIT_HASH = '37e8f0f';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Zap size={60} color="#2196F3" fill="#2196F3" />
        <Text style={styles.title}>SkillBridge</Text>
        <Text style={styles.version}>Versão 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o Projeto</Text>
        <Text style={styles.text}>
          Plataforma de capacitação profissional voltada à transição energética.
          Conecta talentos a cursos e vagas sustentáveis.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Code size={24} color="#2196F3" />
          <Text style={styles.sectionTitle}>Tecnologias</Text>
        </View>
        <Text style={styles.text}>React Native • TypeScript{'\n'}API REST • Spring Boot • JWT</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <CheckCircle size={24} color="#4CAF50" />
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
        </View>
        <Text style={styles.text}>
          • Autenticação segura{'\n'}
          • Listagem de vagas{'\n'}
          • Catálogo de cursos{'\n'}
          • Perfil personalizado
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Commit: {COMMIT_HASH}
        </Text>
        <Text style={styles.footerText}>
          Global Solution - FIAP 2025
        </Text>
      </View>
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
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 15,
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});
