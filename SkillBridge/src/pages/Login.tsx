import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import { login } from '../services/api';

const { width } = Dimensions.get('window');

export default function Login({ navigation, onLogin }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setEmailError('');
    setSenhaError('');

    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      Alert.alert('Erro', 'Preencha o campo de email');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      Alert.alert('Erro', 'Digite um email válido');
      return;
    }

    if (!senha) {
      setSenhaError('Senha é obrigatória');
      Alert.alert('Erro', 'Preencha o campo de senha');
      return;
    }

    if (senha.length < 6) {
      setSenhaError('Senha deve ter pelo menos 6 caracteres');
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), senha });
      onLogin();
    } catch (error: any) {
      let errorMsg = 'Erro ao fazer login';
      let errorTitle = 'Erro';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorTitle = 'Credenciais Inválidas';
          errorMsg = 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
          setEmailError('Email ou senha incorretos');
          setSenhaError('Email ou senha incorretos');
        } else if (status === 404) {
          errorTitle = 'Usuário Não Encontrado';
          errorMsg = 'Nenhuma conta encontrada com este email. Verifique o email ou cadastre-se.';
          setEmailError('Email não cadastrado');
        } else if (status === 400) {
          errorTitle = 'Dados Inválidos';
          errorMsg = data?.message || 'Verifique os dados informados e tente novamente.';
          if (data?.message?.toLowerCase().includes('email')) {
            setEmailError('Email inválido');
          }
          if (data?.message?.toLowerCase().includes('senha')) {
            setSenhaError('Senha inválida');
          }
        } else if (status === 500) {
          errorTitle = 'Erro no Servidor';
          errorMsg = 'Ocorreu um erro no servidor. Tente novamente em alguns instantes.';
        } else if (status === 403) {
          errorTitle = 'Acesso Negado';
          errorMsg = 'Você não tem permissão para acessar. Entre em contato com o suporte.';
        } else if (data?.message) {
          errorMsg = data.message;
        } else {
          errorMsg = `Erro do servidor (${status})`;
        }
      } else if (error.request) {
        errorTitle = 'Sem Conexão';
        errorMsg = 'Não foi possível conectar ao servidor.\n\nVerifique:\n• Sua conexão com a internet\n• Se a API está rodando\n• Se a URL está correta';
      } else if (error.message) {
        errorMsg = error.message;
        if (error.message.includes('conectar') || error.message.includes('Network')) {
          errorTitle = 'Sem Conexão';
        }
      }
      
      console.error('Erro completo:', error);
      Alert.alert(errorTitle, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../images/logoSkillBridge.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
            <Mail size={20} color={emailError ? "#f44336" : "#666"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, senhaError ? styles.inputError : null]}>
            <Lock size={20} color={senhaError ? "#f44336" : "#666"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={senha}
              onChangeText={(text) => {
                setSenha(text);
                if (senhaError) setSenhaError('');
              }}
              secureTextEntry
            />
          </View>
          {senhaError ? <Text style={styles.errorText}>{senhaError}</Text> : null}
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>
            Não tem conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: width * 0.12,
  },
  logoImage: {
    width: width * 0.4,
    height: width * 0.4,
    maxWidth: 200,
    maxHeight: 200,
  },
  inputGroup: {
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginLeft: 15,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 25,
    alignItems: 'center',
  },
  linkText: {
    color: '#2196F3',
    fontSize: 15,
    fontWeight: '500',
  },
});
