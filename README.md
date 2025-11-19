# SkillBridge - Plataforma de Capacitação Profissional

## Introdução

O **SkillBridge** é uma plataforma inovadora de capacitação profissional voltada à transição energética e requalificação de talentos. A aplicação conecta profissionais a oportunidades de cursos e vagas sustentáveis, utilizando Inteligência Artificial Generativa para fornecer recomendações personalizadas e planos de estudos adaptados ao perfil de cada usuário.

## Problemas que Motivaram a Criação

A plataforma SkillBridge foi desenvolvida para resolver desafios críticos enfrentados por profissionais em transição de carreira, especialmente na área de energia sustentável:

### 1. Desconexão entre Habilidades e Oportunidades

- Profissionais frequentemente não sabem quais competências desenvolver para alcançar seus objetivos de carreira
- Falta de visibilidade sobre vagas adequadas ao seu perfil atual
- Dificuldade em identificar gaps de conhecimento

### 2. Falta de Personalização no Aprendizado

- Cursos genéricos que não atendem às necessidades específicas de cada profissional
- Ausência de planos de estudos estruturados e personalizados
- Falta de orientação sobre o caminho ideal para requalificação

### 3. Transição para Energia Sustentável

- Necessidade urgente de requalificar profissionais para o setor de energia renovável
- Demanda crescente por competências em tecnologias sustentáveis
- Oportunidades de carreira em expansão que precisam ser preenchidas

### 4. Ineficiência na Busca de Oportunidades

- Processo manual e demorado de busca por vagas e cursos
- Falta de recomendações inteligentes baseadas em perfil e competências
- Ausência de cálculo automático de compatibilidade entre candidato e vaga

## Solução Proposta

O SkillBridge oferece uma solução completa e integrada que resolve esses problemas através de:

### Recomendações Inteligentes com IA

- Sistema de recomendações baseado nas competências cadastradas do usuário
- Análise de compatibilidade automática entre perfil profissional e vagas disponíveis
- Sugestões personalizadas de cursos e oportunidades de carreira

### Planos de Estudos Personalizados

- Geração automática de planos de estudos usando IA Generativa (Gemini)
- Planos adaptados ao nível atual, objetivo de carreira e tempo disponível
- Etapas estruturadas com recursos sugeridos e métricas de sucesso

### Plataforma Integrada

- Aplicativo mobile React Native para acesso fácil e rápido
- API REST robusta com Spring Boot para gerenciamento de dados
- Integração com Oracle Database para persistência confiável
- Módulo IoT com Deep Learning para processamento avançado

### Gestão Completa de Carreira

- Cadastro de perfil profissional com competências e objetivos
- Acompanhamento de candidaturas a vagas
- Histórico de recomendações e planos de estudos gerados

## Arquitetura da Solução

```
┌─────────────────┐
│  Mobile App     │  React Native + TypeScript
│  (React Native) │
└────────┬────────┘
         │
         │ HTTPS/REST
         │
┌────────▼────────────────────────┐
│  API Java (Spring Boot)         │  Porta 8080
│  - Autenticação JWT             │
│  - Gerenciamento de Usuários    │
│  - Vagas e Cursos               │
│  - Recomendações Básicas        │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌──────────────────┐
│ Oracle │  │  API IoT Python  │  Porta 8000
│Database│  │  (FastAPI)        │
│        │  │  - IA Generativa  │
│        │  │  - Planos Estudos │
└────────┘  └────────┬──────────┘
                     │
                     ▼
              ┌──────────────┐
              │ Gemini API   │
              │ (Google AI)  │
              └──────────────┘
```

## Funcionalidades Principais

### Para Usuários

- **Cadastro e Autenticação** com JWT
- **Perfil Profissional** com competências e objetivos de carreira
- **Busca de Vagas** com filtros e detalhamento completo
- **Catálogo de Cursos** com informações detalhadas
- **Recomendações Personalizadas** baseadas em competências
- **Planos de Estudos Personalizados** gerados com IA
- **Acompanhamento de Candidaturas** a vagas
- **Cálculo de Compatibilidade** automático com vagas

### Para Administradores

- **Gerenciamento de Usuários, Vagas e Cursos**
- **Sistema de Recomendações com IA Generativa**
- **Auditoria e Logs** de operações
- **API REST completa** com documentação Swagger

## Stack Tecnológica

### Backend

- **Java 21** + **Spring Boot 3.5.7**
- **Oracle Database 19c**
- **Spring Security** + **JWT**
- **Spring Data JPA**

### IA e Processamento

- **Python 3.12** + **FastAPI**
- **Google Gemini API** (IA Generativa)
- **Deep Learning** para geração de conteúdo

### Frontend Mobile

- **React Native** + **TypeScript**
- **React Navigation**
- **Axios** para requisições HTTP

## Estrutura do Projeto

```
GSMobile2/
├── api/                    # API Java Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── bancodedados/          # Scripts Oracle e MongoDB
│   ├── sql/
│   ├── nosql/
│   └── README.md
├── IOT/                   # Módulo Python (Deep Learning)
│   └── ProjetoIOTSkillBridge/
│       └── GlobalSolutionIOT/
│           ├── main.py
│           ├── gerar_plano_estudos.py
│           └── README.md
├── SkillBridge/           # Aplicativo Mobile React Native
│   ├── src/
│   ├── package.json
│   └── README.md
├── postman/              # Coleção Postman para testes
│   └── SkillBridge.postman_collection.json
└── README.md            # Este arquivo
```

## Integração entre Módulos

```
Cliente Mobile
    ↓
API Java (Spring Boot) - Porta 8080
    ↓                    ↓
Oracle Database    API IoT (Python) - Porta 8000
                        ↓
                    Gemini API
```

## Sobre o Projeto

Este projeto foi desenvolvido como parte da **Global Solution FIAP**, focando em soluções inovadoras para a transição energética e capacitação profissional. O SkillBridge representa uma abordagem moderna e tecnológica para conectar talentos a oportunidades, utilizando Inteligência Artificial para personalizar a experiência de cada usuário.

---

## Como Executar a Aplicação

### Opção 1: Executar Localmente

#### Pré-requisitos

- **Java 21** instalado
- **Maven 3.9+** instalado
- **Python 3.12+** instalado
- **Node.js 18+** e npm instalados
- **Oracle Database** acessível (ou usar banco local)
- **Chave API Gemini** (obtenha em: https://aistudio.google.com/apikey)

#### Passo 1: Configurar Banco de Dados

```bash
cd bancodedados
# Execute os scripts SQL na ordem:
# 1. create_tables.sql
# 2. functions.sql
# 3. packages.sql
# 4. triggers.sql
# 5. create_recomendacao_ia_table.sql
```

**Ver instruções detalhadas:** `bancodedados/README.md`

#### Passo 2: Configurar e Executar API Java

```bash
cd api

# Editar src/main/resources/application.properties:
# - Configurar credenciais do Oracle
# - Configurar JWT_SECRET
# - Configurar GEMINI_API_KEY
# - Configurar iot.service.url=http://localhost:8000

# Instalar dependências
mvn clean install

# Executar API
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Health Check: `http://localhost:8080/actuator/health`

**Ver instruções completas:** `api/README.md`

#### Passo 3: Configurar e Executar API IoT (Python)

```bash
cd IOT/ProjetoIOTSkillBridge/GlobalSolutionIOT

# Criar arquivo .env com:
# GEMINI_API_KEY=sua-chave-aqui

# Instalar dependências
pip install -r requirements.txt

# Executar servidor
python -m uvicorn main:app --reload --port 8000
```

A API IoT estará disponível em: `http://localhost:8000`

- Documentação: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

**Ver instruções completas:** `IOT/README.md`

#### Passo 4: Executar Aplicativo Mobile

```bash
cd SkillBridge

# Instalar dependências
npm install

# Para desenvolvimento local, editar src/config/api.ts:
# - API_URL: 'http://localhost:8080' (iOS Simulator)
# - API_URL: 'http://10.0.2.2:8080' (Android Emulator)

# Iniciar aplicativo
npm start
```

**Ver instruções completas:** `SkillBridge/README.md`

---

### Opção 2: Usar APIs em Produção (Render)

As APIs estão disponíveis em produção através do Render. Esta é a opção mais rápida para testar a aplicação sem configurar o ambiente local.

#### IMPORTANTE: Sobre a Hibernação do Render

O Render oferece um plano gratuito que coloca os serviços em **hibernação após 15 minutos de inatividade**. Isso significa que:

- **Primeira requisição após hibernação pode levar 30-60 segundos** para "acordar" o serviço
- **Recomendamos acessar os links alguns minutos antes** de usar a aplicação para garantir que os serviços estejam ativos
- Após o "despertar", os serviços funcionam normalmente até o próximo período de inatividade

#### URLs das APIs em Produção

- **API Java (Spring Boot)**:

  - Base URL: `https://projetojavaskillbridge.onrender.com`
  - Swagger UI: `https://projetojavaskillbridge.onrender.com/swagger-ui.html`
  - Health Check: `https://projetojavaskillbridge.onrender.com/actuator/health`

- **API IoT (Python FastAPI)**:
  - Base URL: `https://projetoiotskillbridge.onrender.com`
  - Documentação: `https://projetoiotskillbridge.onrender.com/docs`
  - Health Check: `https://projetoiotskillbridge.onrender.com/health`

#### Configurar Aplicativo Mobile para Produção

O aplicativo mobile já está configurado para usar as APIs de produção por padrão. Se precisar alterar:

```bash
cd SkillBridge

# O arquivo src/config/api.ts já está configurado com:
# - API_URL: 'https://projetojavaskillbridge.onrender.com'
# - IOT_API_URL: 'https://projetoiotskillbridge.onrender.com'

# Apenas execute:
npm install
npm start
```

#### Dicas para Usar APIs em Produção

1. **Antes de testar**: Acesse os links de Health Check acima para "acordar" os serviços
2. **Aguarde 30-60 segundos** após a primeira requisição se os serviços estiverem hibernando
3. **Use o Swagger UI** para testar os endpoints antes de usar o app mobile
4. **Em caso de timeout**: Aguarde alguns minutos e tente novamente

---

## Testes

### Testar API Java

```bash
cd api
mvn test
```

### Testar com Postman

1. Importe a coleção: `postman/SkillBridge.postman_collection.json`
2. Configure `{{base_url}}` = `http://localhost:8080` (ou URL do Render)
3. Execute `Auth - Registrar usuário` → `Auth - Login`
4. Copie o token para `{{auth_token}}`
5. Teste os endpoints protegidos

## Documentação Adicional

- **API Java**: `api/README.md`
- **Banco de Dados**: `bancodedados/README.md`
- **Módulo IoT**: `IOT/README.md`
- **Aplicativo Mobile**: `SkillBridge/README.md`
- **Coleção Postman**: `postman/SkillBridge.postman_collection.json`

---

**SkillBridge – Conectando talentos, habilidades e oportunidades no futuro da energia sustentável.**
