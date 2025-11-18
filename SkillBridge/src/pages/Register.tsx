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
} from "react-native";
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

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha nome, email e senha");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await register({
        nome,
        email,
        senha,
        telefone: telefone || undefined,
        cidade: cidade || undefined,
        uf: uf || undefined,
        objetivoCarreira: objetivoCarreira || undefined,
        competencias: competencias.length > 0 ? competencias : undefined,
      });
      onRegister();
    } catch (error: any) {
      let errorMsg = "Erro ao cadastrar";

      if (error.message) {
        errorMsg = error.message;
      } else if (error.response) {
        if (error.response.status === 400) {
          errorMsg =
            error.response.data?.message ||
            "Dados inválidos. Verifique se todos os campos estão corretos.";
        } else if (error.response.status === 409) {
          errorMsg = "Este email já está cadastrado";
        } else if (error.response.data?.message) {
          errorMsg = error.response.data.message;
        } else {
          errorMsg = `Erro do servidor (${error.response.status})`;
        }
      } else if (error.request) {
        errorMsg =
          "Não foi possível conectar ao servidor.\n\nVerifique:\n• Se a API está rodando na porta 8080\n• Se a URL está correta no arquivo config/api.ts\n• Se está usando o IP correto para dispositivo físico";
      } else {
        errorMsg = error.message || "Erro desconhecido";
      }

      console.error("Erro completo:", error);
      Alert.alert("Erro", errorMsg);
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

        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo</Text>

        <View style={styles.inputContainer}>
          <User size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nome completo *"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha *"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone (opcional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="(11) 98888-7777"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />
          </View>
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

          <View style={[styles.inputContainer, styles.inputUf]}>
            <TextInput
              style={styles.input}
              placeholder="UF"
              value={uf}
              onChangeText={(text) => setUf(text.toUpperCase())}
              maxLength={2}
            />
          </View>
        </View>

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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
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
