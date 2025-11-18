export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cidade?: string;
  uf?: string;
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
}

export interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  localidade: string;
  salario?: string;
  descricao: string;
}

export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  instrutor: string;
  carga_horaria: number;
}

