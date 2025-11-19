from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from google import genai 
from google.genai import types 
import os
from dotenv import load_dotenv
from pathlib import Path


env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)


print("GEMINI_API_KEY carregada?:", os.getenv("GEMINI_API_KEY") is not None)


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(
    title="Módulo de IA - Recomendações de Cursos e Vagas",
    description="IA integrada a IoT/IoB para recomendações personalizadas e resumo de vagas",
    version="1.0.0",
)

# Configurar CORS para permitir requisições da API Java
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PerfilUsuario(BaseModel):
    nome: str
    idade: int
    nivel_formacao: str
    objetivos: str
    habilidades: List[str]
    interesses: List[str]
    dados_iot: Optional[Dict] = None


class Vaga(BaseModel):
    titulo: str
    descricao_completa: str
    perfil_usuario: Optional[PerfilUsuario] = None


@app.post("/recomendacoes")
async def gerar_recomendacoes(perfil: PerfilUsuario):
    try:
        system_msg = (
            "Você é um orientador de carreira para estudantes brasileiros. "
            "Use linguagem simples, objetiva e motivadora. "
            "Leve em conta o perfil do usuário e também os dados de IoT/IoB "
            "(hábitos, tempo de estudo, preferências de uso do app, etc.). "
            "Responda SEMPRE em português."
        )

        user_msg = f"""
Perfil do usuário:
- Nome: {perfil.nome}
- Idade: {perfil.idade}
- Nível de formação: {perfil.nivel_formacao}
- Objetivos: {perfil.objetivos}
- Habilidades: {", ".join(perfil.habilidades)}
- Interesses: {", ".join(perfil.interesses)}
- Dados IoT/IoB: {perfil.dados_iot}
"""

        # Chamada para a API do Gemini
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_msg, 
            config=types.GenerateContentConfig(
                system_instruction=system_msg,
                temperature=0.7,
            ),
        )

        resposta = response.text 
        return {"recomendacoes": resposta}

    except Exception:
        resposta_falsa = (
            "Modo offline (simulação):\n\n"
            "1. Curso recomendado: **Desenvolvimento Backend com Java (iniciante)** — ideal para fortalecer sua lógica.\n"
            "2. Curso recomendado: **Fundamentos de IA Generativa** — combina com seu interesse em IA.\n"
            "3. Curso recomendado: **Git e Versionamento de Código** — essencial para projetos colaborativos.\n\n"
            "Sugestão de vagas: Estágio em Backend, Suporte Técnico, Jovem Aprendiz em TI.\n\n"
            "Observação: baseado nos dados IoT, seu foco e horário de estudo são adequados para rotinas noturnas."
        )
        return {"recomendacoes": resposta_falsa}


# Importar módulo de plano de estudos (opcional - pode executar gerar_plano_estudos.py separadamente)
try:
    from gerar_plano_estudos import (
        PlanoEstudosRequest as PlanoRequest,
        PlanoEstudosResponse,
        gerar_plano_estudos_endpoint
    )
    
    # Adicionar rota do módulo ao app principal
    app.add_api_route(
        "/gerar-plano-estudos",
        gerar_plano_estudos_endpoint,
        methods=["POST"],
        response_model=PlanoEstudosResponse,
        tags=["Plano de Estudos"]
    )
except ImportError:
    # Se módulo não disponível, criar endpoint básico
    @app.post("/gerar-plano-estudos")
    async def gerar_plano_estudos_fallback(perfil: PerfilUsuario):
        return {"mensagem": "Módulo de plano de estudos não disponível. Execute gerar_plano_estudos.py separadamente."}


@app.post("/resumo-vaga")
async def resumir_vaga(vaga: Vaga):
    try:
        system_msg = (
            "Você é um assistente de carreira que resume vagas de emprego. "
            "Sempre responda em português, em tópicos, de forma simples."
        )

        perfil_txt = "Nenhum perfil informado."
        if vaga.perfil_usuario is not None:
            p = vaga.perfil_usuario
            perfil_txt = f"""
Perfil do usuário:
- Idade: {p.idade}
- Formação: {p.nivel_formacao}
- Objetivos: {p.objetivos}
- Habilidades: {", ".join(p.habilidades)}
- Interesses: {", ".join(p.interesses)}
- Dados IoT/IoB: {p.dados_iot}
"""

        user_msg = f"""
Título da vaga: {vaga.titulo}

Descrição completa da vaga:
'''{vaga.descricao_completa}'''

{perfil_txt}

Tarefas:
1) Faça um RESUMO da vaga em no máximo 5 linhas.
2) Liste os principais REQUISITOS em tópicos.
3) Liste BENEFÍCIOS se houver, ou diga que não estão claros.
4) Aponte PONTOS DE ATENÇÃO (ex.: jornada, salário não informado, experiência exigida).
5) Se o perfil do usuário foi informado, diga se essa vaga é adequada
   e o que ele ainda precisa estudar ou melhorar.
"""

        # Chamada para a API do Gemini
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_msg,
            config=types.GenerateContentConfig(
                system_instruction=system_msg,
                temperature=0.5,
            ),
        )

        resposta = response.text
        return {"analise_vaga": resposta}

    except Exception:
        resumo_falso = (
            "Modo offline (simulação):\n\n"
            "Resumo: Vaga de estágio para auxiliar no desenvolvimento de APIs e manutenção de sistemas backend.\n"
            "Requisitos: lógica de programação, noções de Java e Git.\n"
            "Benefícios: não informados.\n"
            "Pontos de atenção: jornada de trabalho e salário não especificados.\n"
            "Avaliação do perfil: adequado — já possui conhecimentos em Java e Python, basta aprofundar em REST e banco de dados."
        )
        return {"analise_vaga": resumo_falso}


@app.get("/")
async def root():
    """Rota raiz - informações da API"""
    return {
        "mensagem": "Bem-vindo à API de IA - Recomendações de Cursos e Vagas",
        "servico": "IOT - Geração de Plano de Estudos",
        "versao": "1.0.0",
        "modelo_ia": "Gemini 2.5 Flash",
        "endpoints": {
            "documentacao": "/docs",
            "health_check": "/health",
            "recomendacoes": "/recomendacoes",
            "resumo_vaga": "/resumo-vaga",
            "gerar_plano_estudos": "/gerar-plano-estudos"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "servico": "IOT - Geração de Plano de Estudos",
        "modelo_ia": "Gemini 2.5 Flash"
    }