export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cidade?: string;
  uf?: string;
  objetivoCarreira?: string;
  competencias?: string[];
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  cidade?: string;
  uf?: string;
  objetivoCarreira?: string;
  competencias?: string[];
}

export interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  localidade: string;
  requisitos?: string[];
  responsabilidades?: string;
  salario?: string | number;
  tipoContrato?: string;
  formatoTrabalho?: string;
  nivelSenioridade?: string;
  dataPublicacao?: string;
  dataEncerramento?: string;
  // Campos legados para compatibilidade
  descricao?: string;
  competenciasRequeridas?: string[];
}

export interface Curso {
  id: string;
  nome: string;
  area: string;
  duracaoHoras: number;
  modalidade: string;
  instituicao?: string;
  descricao: string;
  nivel?: string;
  dataCriacao?: string;
  // Campos legados para compatibilidade (se vierem do backend)
  titulo?: string;
  instrutor?: string;
  carga_horaria?: number;
  competencias?: string[];
}

export interface RecomendacaoBasica {
  cursos: Curso[];
  vagas: Vaga[];
  insight?: string;
}

export interface RecomendacaoIA {
  id?: string;
  resumoPerfil: string;
  planoCarreira: string;
  cursosRecomendados: Curso[];
  vagasRecomendadas: Vaga[];
  dataGeracao?: string;
}

export interface PlanoEstudosRequest {
  objetivoCarreira: string;
  nivelAtual: 'Iniciante' | 'Intermediário' | 'Avançado';
  competenciasAtuais: string[];
  tempoDisponivelSemana: number;
  prazoMeses: number;
  areasInteresse?: string[];
}

export interface EtapaEstudo {
  ordem: number;
  titulo: string;
  descricao: string;
  duracaoSemanas: number;
  recursosSugeridos: string[];
  competenciasDesenvolvidas: string[];
}

export interface PlanoEstudosResponse {
  objetivoCarreira: string;
  nivelAtual: string;
  prazoTotalMeses: number;
  horasTotaisEstimadas: number;
  etapas: EtapaEstudo[];
  recursosAdicionais: string[];
  metricasSucesso: string[];
  motivacao: string;
}

export interface Aplicacao {
  id: string;
  usuarioId?: string;
  vagaId: string;
  vaga?: Vaga;
  status: 'EM_ANALISE' | 'APROVADA' | 'REJEITADA';
  pontuacaoCompatibilidade?: number;
  comentariosAvaliador?: string;
  dataAplicacao?: string;
}

export interface AplicacaoRequest {
  vagaId: string;
  compatibilidade?: number;
}

