# IOT - Módulo de Deep Learning e IA Generativa

Módulo Python/FastAPI que implementa Inteligência Artificial Generativa usando Google Gemini para gerar planos de estudos personalizados, recomendações de carreira e análises de vagas. Este módulo é integrado com a API Java Spring Boot e demonstra o uso de IA Generativa em uma aplicação prática.

## Sobre o Módulo IoT

O módulo IoT do SkillBridge é responsável por processar requisições de IA Generativa, utilizando a API do Google Gemini para gerar conteúdo personalizado e estruturado. O módulo oferece três funcionalidades principais: geração de planos de estudos, recomendações personalizadas e análise de vagas.

### Funcionalidades Principais

- Geração de planos de estudos personalizados com IA
- Recomendações de carreira baseadas em perfil do usuário
- Análise e resumo de vagas de emprego
- Integração com Google Gemini API
- Prompt Engineering avançado
- Geração de conteúdo estruturado em JSON
- Tratamento robusto de erros com fallback
- API REST documentada com Swagger

## Arquitetura

O módulo é construído com FastAPI, um framework web moderno e rápido para Python. A arquitetura segue o padrão RESTful:

```
Cliente (API Java ou Mobile)
    ↓
FastAPI (Python)
    ↓
Google Gemini API
    ↓
Resposta estruturada (JSON)
```

### Endpoints Disponíveis

1. **POST `/gerar-plano-estudos`** - Gera plano de estudos personalizado
2. **POST `/recomendacoes`** - Gera recomendações de carreira
3. **POST `/resumo-vaga`** - Analisa e resume vagas de emprego
4. **GET `/health`** - Health check do serviço
5. **GET `/`** - Informações da API

## Stack Tecnológica

- **Python 3.10+** - Linguagem de programação
- **FastAPI** - Framework web moderno e rápido
- **Uvicorn** - Servidor ASGI de alta performance
- **Google Gemini API** - IA Generativa (modelo gemini-2.5-flash)
- **Pydantic** - Validação de dados e modelos
- **python-dotenv** - Gerenciamento de variáveis de ambiente

## Pré-requisitos

- **Python 3.10+** instalado
- **pip** (gerenciador de pacotes Python)
- **Chave da API Gemini** (obtenha em: https://aistudio.google.com/apikey)

## Instalação

### 1. Instalar Dependências

```bash
cd IOT/ProjetoIOTSkillBridge/GlobalSolutionIOT
pip install -r requirements.txt
```

**Dependências principais:**

- `fastapi` - Framework web para APIs REST
- `uvicorn[standard]` - Servidor ASGI para produção
- `google-genai` - Cliente oficial da API Gemini
- `pydantic` - Validação de dados e serialização
- `python-dotenv` - Carregamento de variáveis de ambiente

### 2. Configurar Chave da API Gemini

Crie arquivo `.env` na pasta `IOT/ProjetoIOTSkillBridge/GlobalSolutionIOT/`:

```env
GEMINI_API_KEY=sua-chave-gemini-aqui
```

**Como obter a chave:**

1. Acesse: https://aistudio.google.com/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada (formato: `AIzaSy...`)
5. Cole no arquivo `.env`

**Importante:** Nunca commite o arquivo `.env` com a chave real no repositório.

## Como Executar

### Executar Localmente

```bash
cd IOT/ProjetoIOTSkillBridge/GlobalSolutionIOT
python -m uvicorn main:app --reload --port 8000
```

O servidor estará disponível em: `http://localhost:8000`

### Verificar se está rodando

```bash
curl http://localhost:8000/health
```

**Resposta esperada:**

```json
{
  "status": "ok",
  "servico": "IOT - Geração de Plano de Estudos",
  "modelo_ia": "Gemini 2.5 Flash"
}
```

### Executar em Produção

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Endpoints Detalhados

### POST `/gerar-plano-estudos`

Gera um plano de estudos personalizado usando IA Generativa baseado no perfil, objetivos e disponibilidade do usuário.

**Request Body:**

```json
{
  "objetivo_carreira": "Tornar-me desenvolvedor Java Sênior",
  "nivel_atual": "Intermediário",
  "competencias_atuais": ["Java", "Spring Boot", "SQL"],
  "tempo_disponivel_semana": 15,
  "prazo_meses": 6,
  "areas_interesse": ["Microservices", "Cloud Computing"]
}
```

**Response:**

```json
{
  "objetivo_carreira": "Tornar-me desenvolvedor Java Sênior",
  "nivel_atual": "Intermediário",
  "prazo_total_meses": 6,
  "horas_totais_estimadas": 360,
  "etapas": [
    {
      "ordem": 1,
      "titulo": "Fundamentos e Base Sólida",
      "descricao": "Estabeleça uma base sólida em Java, Spring Boot...",
      "duracao_semanas": 8,
      "recursos_sugeridos": [
        "Curso: Java Completo (Udemy)",
        "Documentação oficial: Oracle Java Documentation"
      ],
      "competencias_desenvolvidas": ["Java", "Spring Boot"]
    }
  ],
  "recursos_adicionais": [
    "Comunidades online (Stack Overflow, Reddit)",
    "Certificações profissionais"
  ],
  "metricas_sucesso": [
    "Conclusão de projetos práticos",
    "Aplicação do conhecimento em situações reais"
  ],
  "motivacao": "Você está no caminho certo para alcançar seu objetivo..."
}
```

**Funcionalidades:**
- Análise do perfil do usuário
- Criação de etapas estruturadas
- Estimativa de tempo e horas necessárias
- Sugestão de recursos de aprendizado
- Definição de métricas de sucesso
- Mensagem motivacional personalizada

### POST `/recomendacoes`

Gera recomendações personalizadas de cursos e vagas baseadas no perfil completo do usuário, incluindo dados de IoT/IoB quando disponíveis.

**Request Body:**

```json
{
  "nome": "João Silva",
  "idade": 25,
  "nivel_formacao": "Superior em andamento",
  "objetivos": "Tornar-me desenvolvedor backend",
  "habilidades": ["Java", "Python", "SQL"],
  "interesses": ["Backend", "APIs", "Microservices"],
  "dados_iot": {
    "tempo_estudo_semana": 20,
    "horario_preferido": "noite",
    "plataforma_preferida": "mobile"
  }
}
```

**Response:**

```json
{
  "recomendacoes": "Baseado no seu perfil e nos dados de IoT, recomendo..."
}
```

**Funcionalidades:**
- Análise completa do perfil
- Consideração de dados IoT/IoB (hábitos, preferências)
- Recomendações de cursos adequados
- Sugestões de vagas compatíveis
- Linguagem simples e motivadora

### POST `/resumo-vaga`

Analisa uma vaga de emprego e gera um resumo estruturado, incluindo requisitos, benefícios e avaliação de adequação ao perfil do usuário.

**Request Body:**

```json
{
  "titulo": "Desenvolvedor Java Pleno",
  "descricao_completa": "Descrição completa da vaga...",
  "perfil_usuario": {
    "nome": "João Silva",
    "idade": 25,
    "nivel_formacao": "Superior",
    "objetivos": "Crescer na carreira",
    "habilidades": ["Java", "Spring Boot"],
    "interesses": ["Backend"]
  }
}
```

**Response:**

```json
{
  "analise_vaga": "Resumo da vaga em tópicos:\n1. Resumo...\n2. Requisitos...\n3. Benefícios...\n4. Pontos de atenção...\n5. Avaliação do perfil..."
}
```

**Funcionalidades:**
- Resumo conciso da vaga (máximo 5 linhas)
- Lista de requisitos principais
- Identificação de benefícios
- Pontos de atenção (salário não informado, etc.)
- Avaliação de adequação ao perfil
- Sugestões de melhorias necessárias

### GET `/health`

Endpoint de health check para verificar o status do serviço.

**Response:**

```json
{
  "status": "ok",
  "servico": "IOT - Geração de Plano de Estudos",
  "modelo_ia": "Gemini 2.5 Flash"
}
```

### GET `/`

Endpoint raiz que retorna informações sobre a API e endpoints disponíveis.

## Integração com API Java

A API Java Spring Boot chama este serviço via REST para gerar planos de estudos.

### Fluxo de Integração

1. Cliente (Mobile ou Web) faz requisição: `POST /api/v1/planos-estudos/gerar`
2. API Java valida dados e chama serviço IoT: `POST {iot.service.url}/gerar-plano-estudos`
3. Serviço IoT processa com Gemini API
4. Resposta estruturada retorna via Java → Cliente

### URLs de Produção

- **API Java:** `https://projetojavaskillbridge.onrender.com`
- **Serviço IoT:** `https://projetoiotskillbridge.onrender.com`

### Configuração na API Java

No arquivo `application.properties` da API Java:

```properties
# Produção (Render)
iot.service.url=https://projetoiotskillbridge.onrender.com

# Desenvolvimento local
iot.service.url=http://localhost:8000
```

### CORS

O módulo está configurado para aceitar requisições de qualquer origem (CORS habilitado). Em produção, recomenda-se restringir para domínios específicos.

## Como Funciona a IA

### Prompt Engineering

O sistema utiliza técnicas avançadas de prompt engineering:

- **System Instructions**: Define o papel e comportamento da IA
- **Contexto Estruturado**: Organiza informações do usuário de forma clara
- **Instruções Específicas**: Define formato de resposta esperado
- **Temperature Control**: Ajusta criatividade vs consistência (0.5-0.7)

### Processamento de Respostas

- Validação de formato JSON
- Estruturação de dados quando necessário
- Tratamento de respostas parciais ou inválidas
- Fallback inteligente em caso de erro

### Tratamento de Erros

O sistema implementa tratamento robusto de erros:

- **Quota Excedida**: Sistema usa fallback com plano básico
- **API Indisponível**: Retorna plano baseado em regras pré-definidas
- **Resposta Inválida**: Processa e estrutura resposta manualmente
- **Timeout**: Retorna erro apropriado ao cliente

### Logs Detalhados

O sistema registra informações importantes:

- Tentativa de chamada ao Gemini
- Chave API sendo usada (parcialmente mascarada)
- Sucesso ou erro na chamada
- Uso de fallback quando necessário
- Tempo de resposta

## Documentação Swagger

Após iniciar o servidor, acesse a documentação interativa:

```
http://localhost:8000/docs
```

A documentação Swagger permite:
- Visualizar todos os endpoints
- Testar requisições diretamente
- Ver schemas de request/response
- Entender parâmetros necessários

## Estrutura do Projeto

```
IOT/
└── ProjetoIOTSkillBridge/
    └── GlobalSolutionIOT/
        ├── main.py                    # Aplicação FastAPI principal
        ├── gerar_plano_estudos.py     # Módulo de geração de planos
        ├── requirements.txt           # Dependências Python
        └── .env                       # Variáveis de ambiente (criar)
```

### Arquivos Principais

- **main.py**: Aplicação FastAPI principal com todos os endpoints
- **gerar_plano_estudos.py**: Módulo especializado para geração de planos
- **requirements.txt**: Lista de dependências Python
- **.env**: Variáveis de ambiente (não versionado)

## Requisitos Atendidos

Este módulo atende aos seguintes requisitos técnicos:

- **IA Generativa**: Utilização da Google Gemini API
- **Prompt Engineering**: Prompts estruturados e personalizados
- **Integração com Java**: REST API funcional e documentada
- **Deep Learning**: Modelo de IA aplicado para geração de conteúdo
- **Tratamento de Erros**: Fallback inteligente e robusto
- **Documentação**: README completo + Swagger automático
- **IoT/IoB**: Consideração de dados de comportamento do usuário

## Troubleshooting

### Erro: "GEMINI_API_KEY não encontrada"

- Verifique se arquivo `.env` existe em `IOT/ProjetoIOTSkillBridge/GlobalSolutionIOT/`
- Confirme que a variável está escrita corretamente: `GEMINI_API_KEY=...`
- Reinicie o servidor após criar/editar o `.env`
- Verifique se não há espaços extras na chave

### Erro 429: Quota Excedida

- A quota gratuita do Gemini tem limites de requisições
- O sistema usa fallback automático quando quota é excedida
- Aguarde alguns minutos ou use outra conta Google
- Considere upgrade para plano pago se necessário

### Erro ao chamar do Java

- Verifique se servidor Python está rodando: `curl http://localhost:8000/health`
- Confirme `iot.service.url` na API Java
- Verifique logs do servidor Python para detalhes
- Teste endpoint diretamente com curl ou Postman

### Porta 8000 já em uso

**Windows PowerShell:**
```bash
netstat -ano | findstr :8000
# Pare o processo ou use outra porta:
python -m uvicorn main:app --reload --port 8001
```

**Linux/Mac:**
```bash
lsof -i :8000
# Pare o processo ou use outra porta:
python -m uvicorn main:app --reload --port 8001
```

### Erro de importação de módulos

- Certifique-se de estar na pasta correta: `GlobalSolutionIOT/`
- Verifique se todas as dependências estão instaladas: `pip install -r requirements.txt`
- Verifique versão do Python: `python --version` (deve ser 3.10+)

### Respostas da IA inconsistentes

- Ajuste o `temperature` no código (0.5 para mais consistente, 0.7 para mais criativo)
- Melhore os prompts para serem mais específicos
- Verifique se o modelo Gemini está disponível (gemini-2.5-flash)

## Deploy em Produção

O módulo está disponível em produção através do Render:

- **URL:** https://projetoiotskillbridge.onrender.com
- **Documentação:** https://projetoiotskillbridge.onrender.com/docs
- **Health Check:** https://projetoiotskillbridge.onrender.com/health

### Nota sobre Hibernação

O Render oferece um plano gratuito que coloca os serviços em hibernação após 15 minutos de inatividade. A primeira requisição após hibernação pode levar 30-60 segundos para "acordar" o serviço.

---

**IOT Module – Gerando planos de estudos personalizados e recomendações inteligentes com IA Generativa.**
