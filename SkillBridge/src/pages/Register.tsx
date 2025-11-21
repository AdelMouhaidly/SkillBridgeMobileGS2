import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get('window');
import {
  User,
  Mail,
  Lock,
  MapPin,
  ArrowLeft,
  Target,
  Tag,
  Plus,
  X,
} from "lucide-react-native";
import { register } from "../services/api";

export default function Register({ navigation, onRegister }: any) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [objetivoCarreira, setObjetivoCarreira] = useState("");
  const [competencias, setCompetencias] = useState<string[]>([]);
  const [competenciaInput, setCompetenciaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const addCompetencia = () => {
    if (
      competenciaInput.trim() &&
      !competencias.includes(competenciaInput.trim())
    ) {
      setCompetencias([...competencias, competenciaInput.trim()]);
      setCompetenciaInput("");
    }
  };

  const removeCompetencia = (comp: string) => {
    setCompetencias(competencias.filter((c) => c !== comp));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const phoneRegex = /^[\d\s\(\)\-\+]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validateUF = (uf: string): boolean => {
    if (!uf) return true;
    return uf.length === 2 && /^[A-Z]{2}$/.test(uf);
  };

  const handleRegister = async () => {
    const newErrors: {[key: string]: string} = {};
    let hasError = false;

    if (!nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
      hasError = true;
    } else if (nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
      hasError = true;
    }

    if (!senha) {
      newErrors.senha = "Senha é obrigatória";
      hasError = true;
    } else if (senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres";
      hasError = true;
    } else if (senha.length > 50) {
      newErrors.senha = "A senha deve ter no máximo 50 caracteres";
      hasError = true;
    }

    if (telefone && !validatePhone(telefone)) {
      newErrors.telefone = "Telefone inválido";
      hasError = true;
    }

    if (uf && !validateUF(uf)) {
      newErrors.uf = "UF deve ter 2 letras maiúsculas";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      const firstError = Object.values(newErrors)[0];
      Alert.alert("Erro de Validação", firstError);
      return;
    }

    setLoading(true);
    try {
      await register({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        telefone: telefone.trim() || undefined,
        cidade: cidade.trim() || undefined,
        uf: uf.trim().toUpperCase() || undefined,
        objetivoCarreira: objetivoCarreira.trim() || undefined,
        competencias: competencias.length > 0 ? competencias : undefined,
      });
      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => onRegister() }
      ]);
    } catch (error: any) {
      let errorMsg = "Erro ao cadastrar";
      let errorTitle = "Erro";
      const newErrors: {[key: string]: string} = {};

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 409 || (data?.message && data.message.toLowerCase().includes('já existe'))) {
          errorTitle = "Email Já Cadastrado";
          errorMsg = "Este email já está cadastrado. Tente fazer login ou use outro email.";
          newErrors.email = "Email já cadastrado";
        } else if (status === 400) {
          errorTitle = "Dados Inválidos";
          errorMsg = data?.message || "Verifique os dados informados e tente novamente.";
          
          if (data?.message) {
            const message = data.message.toLowerCase();
            if (message.includes('email')) {
              newErrors.email = "Email inválido ou já cadastrado";
            }
            if (message.includes('senha')) {
              newErrors.senha = "Senha inválida";
            }
            if (message.includes('nome')) {
              newErrors.nome = "Nome inválido";
            }
          }
        } else if (status === 500) {
          errorTitle = "Erro no Servidor";
          errorMsg = "Ocorreu um erro no servidor. Tente novamente em alguns instantes.";
        } else if (data?.message) {
          errorMsg = data.message;
        } else {
          errorMsg = `Erro do servidor (${status})`;
        }
      } else if (error.request) {
        errorTitle = "Sem Conexão";
        errorMsg = "Não foi possível conectar ao servidor.\n\nVerifique:\n• Sua conexão com a internet\n• Se a API está rodando\n• Se a URL está correta";
      } else if (error.message) {
        errorMsg = error.message;
        if (error.message.includes('conectar') || error.message.includes('Network')) {
          errorTitle = "Sem Conexão";
        }
      }

      setErrors(newErrors);
      console.error("Erro completo:", error);
      Alert.alert(errorTitle, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../images/logoSkillBridge.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo</Text>

        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, errors.nome ? styles.inputError : null]}>
            <User size={20} color={errors.nome ? "#f44336" : "#666"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo *"
              value={nome}
              onChangeText={(text) => {
                setNome(text);
                if (errors.nome) {
                  const newErrors = {...errors};
                  delete newErrors.nome;
                  setErrors(newErrors);
                }
              }}
            />
          </View>
          {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
            <Mail size={20} color={errors.email ? "#f44336" : "#666"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail *"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  const newErrors = {...errors};
                  delete newErrors.email;
                  setErrors(newErrors);
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, errors.senha ? styles.inputError : null]}>
            <Lock size={20} color={errors.senha ? "#f44336" : "#666"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Senha *"
              value={senha}
              onChangeText={(text) => {
                setSenha(text);
                if (errors.senha) {
                  const newErrors = {...errors};
                  delete newErrors.senha;
                  setErrors(newErrors);
                }
              }}
              secureTextEntry
            />
          </View>
          {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone (opcional)</Text>
          <View style={[styles.inputContainer, errors.telefone ? styles.inputError : null]}>
            <TextInput
              style={styles.input}
              placeholder="(11) 98888-7777"
              value={telefone}
              onChangeText={(text) => {
                setTelefone(text);
                if (errors.telefone) {
                  const newErrors = {...errors};
                  delete newErrors.telefone;
                  setErrors(newErrors);
                }
              }}
              keyboardType="phone-pad"
            />
          </View>
          {errors.telefone ? <Text style={styles.errorText}>{errors.telefone}</Text> : null}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.inputCity]}>
            <MapPin size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Cidade"
              value={cidade}
              onChangeText={setCidade}
            />
          </View>

          <View style={[styles.inputContainer, styles.inputUf, errors.uf ? styles.inputError : null]}>
            <TextInput
              style={styles.input}
              placeholder="UF"
              value={uf}
              onChangeText={(text) => {
                setUf(text.toUpperCase());
                if (errors.uf) {
                  const newErrors = {...errors};
                  delete newErrors.uf;
                  setErrors(newErrors);
                }
              }}
              maxLength={2}
            />
          </View>
        </View>
        {errors.uf ? <Text style={styles.errorText}>{errors.uf}</Text> : null}

        <View style={styles.inputContainer}>
          <Target size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Objetivo de Carreira (opcional)"
            value={objetivoCarreira}
            onChangeText={setObjetivoCarreira}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Competências (opcional)</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Ex: Java, Spring Boot"
              value={competenciaInput}
              onChangeText={setCompetenciaInput}
              onSubmitEditing={addCompetencia}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCompetencia}>
              <Plus size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>
          <View style={styles.tagsContainer}>
            {competencias.map((comp, idx) => (
              <View key={idx} style={styles.tag}>
                <Tag size={14} color="#2196F3" />
                <Text style={styles.tagText}>{comp}</Text>
                <TouchableOpacity onPress={() => removeCompetencia(comp)}>
                  <X size={16} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: width * 0.08,
  },
  logoImage: {
    width: width * 0.35,
    height: width * 0.35,
    maxWidth: 180,
    maxHeight: 180,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputError: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginLeft: 15,
    marginTop: -10,
    marginBottom: 5,
  },
  tagInputContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  inputCity: {
    flex: 2,
  },
  inputUf: {
    flex: 1,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 25,
    alignItems: "center",
  },
  linkText: {
    color: "#2196F3",
    fontSize: 15,
    fontWeight: "500",
  },
});
