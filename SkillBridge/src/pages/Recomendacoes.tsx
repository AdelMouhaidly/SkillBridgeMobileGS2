import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Sparkles, ArrowRight } from "lucide-react-native";
import { getUser, getRecomendacoesBasicas } from "../services/api";
import { RecomendacaoBasica, User, Curso, Vaga } from "../types";

export default function Recomendacoes({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [recomendacoesBasicas, setRecomendacoesBasicas] =
    useState<RecomendacaoBasica | null>(null);
  const [loadingBasicas, setLoadingBasicas] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getUser();
      if (userData && userData.id) {
        setUser(userData);
        await loadRecomendacoesBasicas(userData.id);
      } else {
        console.warn(
          "Usuário não encontrado ou sem ID. Não é possível carregar recomendações."
        );
        setRecomendacoesBasicas({ cursos: [], vagas: [] });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setRecomendacoesBasicas({ cursos: [], vagas: [] });
    } finally {
      setLoadingBasicas(false);
    }
  };

  const loadRecomendacoesBasicas = async (usuarioId: string) => {
    try {
      const data = await getRecomendacoesBasicas(usuarioId);
      setRecomendacoesBasicas(data);
    } catch (error: any) {
      console.error("Erro ao carregar recomendações básicas:", error);

      // Tratamento específico para erro 403 (Forbidden)
      if (error.response?.status === 403) {
        console.error(
          "Acesso negado (403). Verifique se o token de autenticação é válido."
        );
        // Criar estrutura vazia em caso de erro de autenticação
        setRecomendacoesBasicas({ cursos: [], vagas: [] });
        return;
      }

      // Criar estrutura vazia em caso de erro
      setRecomendacoesBasicas({ cursos: [], vagas: [] });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderCurso = (curso: Curso) => (
    <TouchableOpacity
      key={curso.id}
      style={styles.itemCard}
      onPress={() =>
        navigation.navigate("CursoDetalhes", { cursoId: curso.id })
      }
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{curso.nome || curso.titulo}</Text>
        <Text style={styles.itemSubtitle} numberOfLines={1}>
          {curso.area} • {curso.duracaoHoras || curso.carga_horaria || 0}h
        </Text>
        {curso.instituicao && (
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {curso.instituicao} • {curso.modalidade}
          </Text>
        )}
        {curso.nivel && (
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            Nível: {curso.nivel}
          </Text>
        )}
      </View>
      <ArrowRight size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderVaga = (vaga: Vaga) => (
    <TouchableOpacity
      key={vaga.id}
      style={styles.itemCard}
      onPress={() => navigation.navigate("VagaDetalhes", { vagaId: vaga.id })}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{vaga.titulo}</Text>
        <Text style={styles.itemSubtitle} numberOfLines={1}>
          {vaga.empresa} • {vaga.localidade}
        </Text>
        {vaga.tipoContrato && (
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {vaga.tipoContrato}{" "}
            {vaga.formatoTrabalho ? `• ${vaga.formatoTrabalho}` : ""}
          </Text>
        )}
        {vaga.nivelSenioridade && (
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {vaga.nivelSenioridade}
          </Text>
        )}
        {vaga.salario && (
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            Salário:{" "}
            {typeof vaga.salario === "number"
              ? `R$ ${vaga.salario.toLocaleString("pt-BR")}`
              : vaga.salario}
          </Text>
        )}
      </View>
      <ArrowRight size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Recomendações</Text>
        <Text style={styles.subtitle}>Baseadas nas suas competências</Text>
        {user?.competencias && user.competencias.length > 0 && (
          <View style={styles.competenciasHeader}>
            <Text style={styles.competenciasHeaderText}>
              Suas competências: {user.competencias.join(", ")}
            </Text>
          </View>
        )}
      </View>

      {/* Recomendações Básicas (Automáticas) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recomendações por Competências</Text>
        <Text style={styles.sectionDescription}>
          Recomendações personalizadas baseadas nas competências cadastradas no
          seu perfil
        </Text>
        {loadingBasicas ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Carregando recomendações...</Text>
          </View>
        ) : recomendacoesBasicas ? (
          <>
            {recomendacoesBasicas.insight && (
              <View style={styles.insightCard}>
                <Text style={styles.insightText}>
                  {recomendacoesBasicas.insight}
                </Text>
              </View>
            )}

            {recomendacoesBasicas.cursos.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Cursos Recomendados</Text>
                {recomendacoesBasicas.cursos.slice(0, 5).map(renderCurso)}
              </View>
            )}

            {recomendacoesBasicas.vagas.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Vagas Recomendadas</Text>
                {recomendacoesBasicas.vagas.slice(0, 5).map(renderVaga)}
              </View>
            )}

            {recomendacoesBasicas.cursos.length === 0 &&
              recomendacoesBasicas.vagas.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Nenhuma recomendação disponível no momento
                  </Text>
                </View>
              )}
          </>
        ) : null}
      </View>
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
    marginBottom: 12,
  },
  competenciasHeader: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  competenciasHeaderText: {
    fontSize: 13,
    color: "#fff",
    lineHeight: 18,
  },
  section: {
    padding: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  subsection: {
    marginTop: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: "#E65100",
    lineHeight: 20,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    gap: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
});
