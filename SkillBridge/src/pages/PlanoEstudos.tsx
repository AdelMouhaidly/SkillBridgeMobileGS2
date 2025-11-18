import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { BookOpen, Plus, X, Sparkles, CheckCircle } from "lucide-react-native";
import { gerarPlanoEstudos, getUser } from "../services/api";
import { PlanoEstudosRequest, PlanoEstudosResponse, User } from "../types";

export default function PlanoEstudos({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<PlanoEstudosRequest>({
    objetivoCarreira: "",
    nivelAtual: "Intermediário",
    competenciasAtuais: [],
    tempoDisponivelSemana: 10,
    prazoMeses: 6,
    areasInteresse: [],
  });
  const [competenciaInput, setCompetenciaInput] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [planoGerado, setPlanoGerado] = useState<PlanoEstudosResponse | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getUser();
    if (userData) {
      setUser(userData);
      if (userData.objetivoCarreira) {
        setFormData((prev) => ({
          ...prev,
          objetivoCarreira: userData.objetivoCarreira || "",
        }));
      }
      if (userData.competencias && userData.competencias.length > 0) {
        setFormData((prev) => ({
          ...prev,
          competenciasAtuais: userData.competencias || [],
        }));
      }
    }
  };

  const addCompetencia = () => {
    if (
      competenciaInput.trim() &&
      !formData.competenciasAtuais.includes(competenciaInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        competenciasAtuais: [
          ...prev.competenciasAtuais,
          competenciaInput.trim(),
        ],
      }));
      setCompetenciaInput("");
    }
  };

  const removeCompetencia = (competencia: string) => {
    setFormData((prev) => ({
      ...prev,
      competenciasAtuais: prev.competenciasAtuais.filter(
        (c) => c !== competencia
      ),
    }));
  };

  const addAreaInteresse = () => {
    if (
      areaInput.trim() &&
      !formData.areasInteresse?.includes(areaInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        areasInteresse: [...(prev.areasInteresse || []), areaInput.trim()],
      }));
      setAreaInput("");
    }
  };

  const removeAreaInteresse = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      areasInteresse: prev.areasInteresse?.filter((a) => a !== area) || [],
    }));
  };

  const handleGerar = async () => {
    if (!formData.objetivoCarreira.trim()) {
      Alert.alert("Erro", "Preencha o objetivo de carreira");
      return;
    }

    if (formData.competenciasAtuais.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos uma competência atual");
      return;
    }

    if (formData.tempoDisponivelSemana <= 0) {
      Alert.alert("Erro", "O tempo disponível deve ser maior que zero");
      return;
    }

    if (!formData.prazoMeses || formData.prazoMeses <= 0) {
      Alert.alert("Erro", "O prazo deve ser maior que zero");
      return;
    }

    setLoading(true);
    try {
      const plano = await gerarPlanoEstudos(formData);
      setPlanoGerado(plano);
      setShowModal(true);
    } catch (error: any) {
      let errorMsg = "Erro ao gerar plano de estudos";
      let errorDetails: string[] = [];

      if (error.response) {
        // Erro do servidor
        const responseData = error.response.data;

        if (error.response.status === 400) {
          // Erro de validação
          if (responseData?.details && Array.isArray(responseData.details)) {
            errorDetails = responseData.details;
            errorMsg = responseData.message || "Erro de validação";
          } else if (responseData?.message) {
            errorMsg = responseData.message;
            if (responseData.details) {
              errorDetails = Array.isArray(responseData.details)
                ? responseData.details
                : [responseData.details];
            }
          } else {
            errorMsg =
              "Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.";
          }
        } else if (error.response.status === 500) {
          errorMsg = "Erro no servidor. Tente novamente mais tarde.";
          if (responseData?.details) {
            errorDetails = Array.isArray(responseData.details)
              ? responseData.details
              : [responseData.details];
          }
        } else if (responseData?.message) {
          errorMsg = responseData.message;
          if (responseData.details) {
            errorDetails = Array.isArray(responseData.details)
              ? responseData.details
              : [responseData.details];
          }
        } else {
          errorMsg = `Erro do servidor (${error.response.status})`;
        }
      } else if (error.request) {
        // Erro de conexão
        errorMsg =
          "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
      } else if (error.message) {
        errorMsg = error.message;
      }

      // Combinar mensagem principal com detalhes
      const fullMessage =
        errorDetails.length > 0
          ? `${errorMsg}\n\n${errorDetails.join("\n")}`
          : errorMsg;

      console.error("Erro completo ao gerar plano:", error);
      Alert.alert("Erro", fullMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Plano de Estudos</Text>
        <Text style={styles.subtitle}>Personalize seu aprendizado</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Objetivo de Carreira *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Tornar-me desenvolvedor Java Sênior"
            value={formData.objetivoCarreira}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, objetivoCarreira: text }))
            }
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nível Atual *</Text>
          <View style={styles.radioGroup}>
            {["Iniciante", "Intermediário", "Avançado"].map((nivel) => (
              <TouchableOpacity
                key={nivel}
                style={[
                  styles.radioButton,
                  formData.nivelAtual === nivel && styles.radioButtonActive,
                ]}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, nivelAtual: nivel as any }))
                }
              >
                <Text
                  style={[
                    styles.radioText,
                    formData.nivelAtual === nivel && styles.radioTextActive,
                  ]}
                >
                  {nivel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Competências Atuais *</Text>
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
            {formData.competenciasAtuais.map((comp) => (
              <View key={comp} style={styles.tag}>
                <Text style={styles.tagText}>{comp}</Text>
                <TouchableOpacity onPress={() => removeCompetencia(comp)}>
                  <X size={16} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Tempo Disponível (horas/semana) *</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="10"
              value={formData.tempoDisponivelSemana.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 0;
                setFormData((prev) => ({
                  ...prev,
                  tempoDisponivelSemana: num,
                }));
              }}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Prazo (meses) *</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="6"
              value={formData.prazoMeses.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 0;
                setFormData((prev) => ({ ...prev, prazoMeses: num }));
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Áreas de Interesse (opcional)</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Ex: Microservices, Cloud"
              value={areaInput}
              onChangeText={setAreaInput}
              onSubmitEditing={addAreaInteresse}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addAreaInteresse}
            >
              <Plus size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>
          <View style={styles.tagsContainer}>
            {formData.areasInteresse?.map((area) => (
              <View key={area} style={styles.tag}>
                <Text style={styles.tagText}>{area}</Text>
                <TouchableOpacity onPress={() => removeAreaInteresse(area)}>
                  <X size={16} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.generateButton,
            loading && styles.generateButtonDisabled,
          ]}
          onPress={handleGerar}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.generateButtonText}>Gerando...</Text>
            </>
          ) : (
            <>
              <Sparkles size={20} color="#fff" />
              <Text style={styles.generateButtonText}>
                Gerar Plano de Estudos
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal com Plano Gerado */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Plano de Estudos Gerado</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {planoGerado && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.planoHeader}>
                  <Text style={styles.planoObjetivo}>
                    {planoGerado.objetivoCarreira}
                  </Text>
                  <View style={styles.planoStats}>
                    <Text style={styles.planoStat}>
                      {planoGerado.prazoTotalMeses} meses
                    </Text>
                    <Text style={styles.planoStat}>
                      {planoGerado.horasTotaisEstimadas} horas
                    </Text>
                  </View>
                </View>

                {planoGerado.etapas.map((etapa) => (
                  <View key={etapa.ordem} style={styles.etapaCard}>
                    <View style={styles.etapaHeader}>
                      <Text style={styles.etapaNumero}>
                        Etapa {etapa.ordem}
                      </Text>
                      <Text style={styles.etapaDuracao}>
                        {etapa.duracaoSemanas} semanas
                      </Text>
                    </View>
                    <Text style={styles.etapaTitulo}>{etapa.titulo}</Text>
                    <Text style={styles.etapaDescricao}>{etapa.descricao}</Text>

                    {etapa.recursosSugeridos.length > 0 && (
                      <View style={styles.etapaSection}>
                        <Text style={styles.etapaSectionTitle}>
                          Recursos Sugeridos:
                        </Text>
                        {etapa.recursosSugeridos.map((recurso, idx) => (
                          <Text key={idx} style={styles.etapaItem}>
                            • {recurso}
                          </Text>
                        ))}
                      </View>
                    )}

                    {etapa.competenciasDesenvolvidas.length > 0 && (
                      <View style={styles.etapaSection}>
                        <Text style={styles.etapaSectionTitle}>
                          Competências Desenvolvidas:
                        </Text>
                        <View style={styles.competenciasTags}>
                          {etapa.competenciasDesenvolvidas.map((comp, idx) => (
                            <View key={idx} style={styles.competenciaTag}>
                              <Text style={styles.competenciaTagText}>
                                {comp}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                ))}

                {planoGerado.recursosAdicionais.length > 0 && (
                  <View style={styles.etapaCard}>
                    <Text style={styles.etapaSectionTitle}>
                      Recursos Adicionais:
                    </Text>
                    {planoGerado.recursosAdicionais.map((recurso, idx) => (
                      <Text key={idx} style={styles.etapaItem}>
                        • {recurso}
                      </Text>
                    ))}
                  </View>
                )}

                {planoGerado.metricasSucesso.length > 0 && (
                  <View style={styles.etapaCard}>
                    <Text style={styles.etapaSectionTitle}>
                      Métricas de Sucesso:
                    </Text>
                    {planoGerado.metricasSucesso.map((metrica, idx) => (
                      <View key={idx} style={styles.metricaItem}>
                        <CheckCircle size={16} color="#2196F3" />
                        <Text style={styles.metricaText}>{metrica}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.motivacaoCard}>
                  <Sparkles size={20} color="#2196F3" />
                  <Text style={styles.motivacaoText}>
                    {planoGerado.motivacao}
                  </Text>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: "#2196F3",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#fff",
    opacity: 0.9,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    textAlignVertical: "top",
  },
  numberInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  radioGroup: {
    flexDirection: "row",
    gap: 12,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  radioButtonActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  radioText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  radioTextActive: {
    color: "#2196F3",
    fontWeight: "600",
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
  halfWidth: {
    flex: 1,
  },
  generateButton: {
    flexDirection: "row",
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    padding: 20,
  },
  planoHeader: {
    marginBottom: 20,
  },
  planoObjetivo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  planoStats: {
    flexDirection: "row",
    gap: 16,
  },
  planoStat: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  etapaCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  etapaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  etapaNumero: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
  },
  etapaDuracao: {
    fontSize: 13,
    color: "#666",
  },
  etapaTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  etapaDescricao: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  etapaSection: {
    marginTop: 12,
  },
  etapaSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  etapaItem: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    marginLeft: 8,
  },
  competenciasTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  competenciaTag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  competenciaTagText: {
    fontSize: 12,
    color: "#2196F3",
  },
  metricaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  metricaText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
  },
  motivacaoCard: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 16,
  },
  motivacaoText: {
    flex: 1,
    fontSize: 14,
    color: "#1976D2",
    lineHeight: 20,
    fontStyle: "italic",
  },
  modalCloseButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
