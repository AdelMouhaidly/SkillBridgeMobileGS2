import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Code, Calendar, Package, ArrowLeft } from 'lucide-react-native';
import { COMMIT_HASH, APP_VERSION, BUILD_DATE } from '../config/buildInfo';

const { width } = Dimensions.get('window');

export default function Sobre({ navigation }: any) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Sobre o App</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../images/logoSkillBridge.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>SkillBridge</Text>
          <Text style={styles.appTagline}>
            Conectando talentos a oportunidades
          </Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Package size={20} color="#2196F3" />
              <Text style={styles.infoTitle}>Versão</Text>
            </View>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Code size={20} color="#2196F3" />
              <Text style={styles.infoTitle}>Commit Hash</Text>
            </View>
            <Text style={styles.infoHash}>{COMMIT_HASH}</Text>
            <Text style={styles.infoSubtext}>
              Hash de referência do commit atual
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Calendar size={20} color="#2196F3" />
              <Text style={styles.infoTitle}>Data de Build</Text>
            </View>
            <Text style={styles.infoValue}>{BUILD_DATE}</Text>
          </View>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Sobre o SkillBridge</Text>
          <Text style={styles.descriptionText}>
            O SkillBridge é uma plataforma inovadora que conecta profissionais 
            a oportunidades de carreira personalizadas. Utilizando inteligência 
            artificial, oferecemos recomendações de vagas e cursos baseadas no 
            seu perfil, competências e objetivos profissionais.
          </Text>
          <Text style={styles.descriptionText}>
            Desenvolva suas habilidades, encontre a vaga ideal e crie um plano 
            de estudos personalizado para alcançar seus objetivos de carreira.
          </Text>
        </View>

        <View style={styles.techCard}>
          <Text style={styles.techTitle}>Informações Técnicas</Text>
          <View style={styles.techItem}>
            <Text style={styles.techLabel}>Framework:</Text>
            <Text style={styles.techValue}>React Native / Expo</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techLabel}>Backend:</Text>
            <Text style={styles.techValue}>Spring Boot</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techLabel}>IA:</Text>
            <Text style={styles.techValue}>Google Gemini</Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#2196F3',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logoCircle: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  logoImage: {
    width: width * 0.22,
    height: width * 0.22,
    maxWidth: 90,
    maxHeight: 90,
  },
  appName: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#F5F5F5',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  infoHash: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  descriptionCard: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  techCard: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 16,
  },
  techTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  techItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  techLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  techValue: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
});
