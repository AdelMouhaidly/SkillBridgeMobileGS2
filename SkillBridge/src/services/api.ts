import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/api';
import authManager from './authManager';
import { 
  LoginData, 
  RegisterData, 
  User, 
  RecomendacaoBasica, 
  RecomendacaoIA, 
  PlanoEstudosRequest, 
  PlanoEstudosResponse,
  Aplicacao,
  AplicacaoRequest,
  Vaga,
  Curso
} from '../types';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('Requisição sem token de autenticação:', config.url);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    
    if (status === 401 || status === 403) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      authManager.logout();
    }
    
    return Promise.reject(error);
  }
);

export const login = async (data: LoginData) => {
  try {
    const response = await api.post('/auth/login', {
      email: data.email,
      senha: data.senha,
    });
    
    if (response.data?.token && response.data?.usuario) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.usuario));
      return response.data;
    } else {
      throw new Error('Resposta inválida do servidor');
    }
  } catch (error: any) {
    console.error('Erro no login:', error);
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando e a URL está correta.');
    }
    throw error;
  }
};

export const register = async (data: RegisterData) => {
  try {
    if (data.senha && data.senha.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    const payload: any = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
    };

    if (data.telefone) payload.telefone = data.telefone;
    if (data.cidade) payload.cidade = data.cidade;
    if (data.uf) payload.uf = data.uf;
    if (data.objetivoCarreira) payload.objetivoCarreira = data.objetivoCarreira;
    if (data.competencias && data.competencias.length > 0) {
      payload.competencias = data.competencias;
    }

    const response = await api.post('/auth/register', payload);
    
    if (response.data?.token && response.data?.usuario) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.usuario));
      return response.data;
    } else {
      throw new Error('Resposta inválida do servidor');
    }
  } catch (error: any) {
    console.error('Erro no registro:', error);
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando e a URL está correta.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

export const getUser = async (): Promise<User | null> => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getUserById = async (userId: string): Promise<User> => {
  const response = await api.get(`/usuarios/${userId}`);
  return response.data;
};

export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
  const response = await api.put(`/usuarios/${userId}`, data);
  const updatedUser = response.data;
  await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  return updatedUser;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`/usuarios/${userId}`);
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem('token');
  return !!token;
};

export const getVagas = async () => {
  const response = await api.get('/vagas?page=0&size=50');
  return response.data.content || response.data || [];
};

export const getVagaById = async (id: string): Promise<Vaga> => {
  const response = await api.get(`/vagas/${id}`);
  return response.data;
};

export const getCursos = async () => {
  const response = await api.get('/cursos?page=0&size=50');
  return response.data.content || response.data || [];
};

export const getCursoById = async (id: string): Promise<Curso> => {
  const response = await api.get(`/cursos/${id}`);
  return response.data;
};

export const getRecomendacoesBasicas = async (usuarioId: string): Promise<RecomendacaoBasica> => {
  const response = await api.get(`/recomendacoes/${usuarioId}`);
  return response.data;
};

export const gerarRecomendacoesIA = async (usuarioId: string): Promise<RecomendacaoIA> => {
  const response = await api.post(`/api/v1/ia/recomendacoes/${usuarioId}`);
  return response.data;
};

export const getRecomendacoesIA = async (usuarioId: string): Promise<RecomendacaoIA | null> => {
  try {
    const response = await api.get(`/api/v1/ia/recomendacoes/${usuarioId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const gerarPlanoEstudos = async (data: PlanoEstudosRequest): Promise<PlanoEstudosResponse> => {
  try {
    const payload: any = {
      objetivoCarreira: data.objetivoCarreira?.trim(),
      nivelAtual: data.nivelAtual,
      competenciasAtuais: data.competenciasAtuais || [],
      tempoDisponivelSemana: data.tempoDisponivelSemana,
    };

    if (data.prazoMeses && data.prazoMeses > 0) {
      payload.prazoMeses = data.prazoMeses;
    }
    if (data.areasInteresse && data.areasInteresse.length > 0) {
      payload.areasInteresse = data.areasInteresse;
    }

    const response = await api.post('/api/v1/planos-estudos/gerar', payload);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao gerar plano de estudos:', error);
    throw error;
  }
};

export const getAplicacoes = async (): Promise<Aplicacao[]> => {
  const user = await getUser();
  if (!user) {
    return [];
  }
  
  const response = await api.get('/aplicacoes?page=0&size=100');
  const allAplicacoes = response.data.content || response.data || [];
  
  return allAplicacoes.filter((aplicacao: Aplicacao) => aplicacao.usuarioId === user.id);
};

export const getAplicacoesByUsuario = async (usuarioId: string): Promise<Aplicacao[]> => {
  const response = await api.get('/aplicacoes?page=0&size=100');
  const allAplicacoes = response.data.content || response.data || [];
  return allAplicacoes.filter((aplicacao: Aplicacao) => aplicacao.usuarioId === usuarioId);
};

export const getAplicacaoById = async (id: string): Promise<Aplicacao> => {
  const response = await api.get(`/aplicacoes/${id}`);
  return response.data;
};

export const criarAplicacao = async (data: AplicacaoRequest): Promise<Aplicacao> => {
  const user = await getUser();
  if (!user) {
    throw new Error('Usuário não encontrado. Faça login novamente.');
  }

  const response = await api.post('/aplicacoes', {
    usuarioId: user.id,
    vagaId: data.vagaId,
    status: 'EM_ANALISE',
    pontuacaoCompatibilidade: data.compatibilidade ? data.compatibilidade : null,
    comentariosAvaliador: null,
  });
  return response.data;
};

export const deletarAplicacao = async (aplicacaoId: string): Promise<void> => {
  await api.delete(`/aplicacoes/${aplicacaoId}`);
};

export default api;

