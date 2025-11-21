# SkillBridge - Aplicativo Mobile React Native

Aplicativo mobile desenvolvido em React Native para a plataforma SkillBridge. O aplicativo permite que profissionais busquem vagas, explorem cursos, recebam recomendações personalizadas e gerem planos de estudos adaptados ao seu perfil profissional.

## Sobre o Aplicativo

O SkillBridge Mobile é uma aplicação multiplataforma (iOS e Android) construída com React Native e Expo. O app oferece uma interface intuitiva e moderna para conectar profissionais a oportunidades de carreira na área de energia sustentável, utilizando Inteligência Artificial para personalizar a experiência de cada usuário.

### Funcionalidades Principais

- Autenticação segura com JWT
- Cadastro de perfil profissional completo
- Busca e visualização de vagas disponíveis
- Catálogo completo de cursos
- Recomendações personalizadas baseadas em competências
- Geração de planos de estudos personalizados com IA
- Acompanhamento de candidaturas a vagas
- Cálculo de compatibilidade com vagas
- Perfil do usuário editável
- Informações sobre o aplicativo

## Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile multiplataforma
- **TypeScript** - Tipagem estática para maior segurança de código
- **Expo** - Plataforma e ferramentas para desenvolvimento React Native
- **Axios** - Cliente HTTP para requisições à API
- **React Navigation** - Navegação entre telas
- **Lucide React Native** - Biblioteca de ícones
- **React Native Safe Area Context** - Gerenciamento de áreas seguras

## Estrutura do Aplicativo

### Telas Principais

#### 1. Login
Tela de autenticação onde o usuário faz login com email e senha. Após autenticação bem-sucedida, o token JWT é armazenado e o usuário é redirecionado para o Dashboard.

**Funcionalidades:**
- Validação de campos
- Exibição de erros de autenticação
- Link para tela de cadastro
- Logo do SkillBridge

#### 2. Cadastro (Register)
Tela para registro de novos usuários no sistema. Permite cadastro completo com informações pessoais, competências e objetivos de carreira.

**Campos:**
- Nome completo (obrigatório)
- Email (obrigatório)
- Senha (obrigatório, mínimo 6 caracteres)
- Telefone (opcional)
- Cidade e UF (opcional)
- Objetivo de carreira (opcional)
- Competências (opcional, múltiplas)

**Funcionalidades:**
- Validação de formulário
- Adição e remoção de competências
- Botão de voltar para login
- Logo do SkillBridge

#### 3. Dashboard
Tela principal do aplicativo após login. Apresenta visão geral com estatísticas, recomendações e ações rápidas.

**Componentes:**
- Saudação personalizada baseada no horário
- Logo do SkillBridge no header
- Imagem hero
- Estatísticas (número de vagas e cursos disponíveis)
- Recomendações personalizadas (cursos e vagas)
- Cards de ação rápida para principais funcionalidades

**Funcionalidades:**
- Pull-to-refresh para atualizar dados
- Navegação para outras telas
- Exibição de recomendações baseadas no perfil

#### 4. Vagas
Lista todas as vagas disponíveis no sistema com informações detalhadas.

**Informações exibidas:**
- Título da vaga
- Nome da empresa
- Localidade
- Tipo de contrato
- Formato de trabalho
- Nível de senioridade
- Salário (quando disponível)
- Descrição

**Funcionalidades:**
- Listagem paginada de vagas
- Navegação para detalhes da vaga
- Pull-to-refresh
- Estado vazio quando não há vagas
- Logo do SkillBridge no header

#### 5. Cursos
Catálogo completo de cursos disponíveis na plataforma.

**Informações exibidas:**
- Nome do curso
- Instituição
- Área de conhecimento
- Duração em horas
- Modalidade (presencial, online, híbrido)
- Nível (iniciante, intermediário, avançado)
- Descrição

**Funcionalidades:**
- Listagem paginada de cursos
- Navegação para detalhes do curso
- Pull-to-refresh
- Estado vazio quando não há cursos
- Logo do SkillBridge no header

#### 6. Recomendações
Tela dedicada para exibir recomendações personalizadas baseadas no perfil e competências do usuário.

**Funcionalidades:**
- Exibição de competências do usuário
- Recomendações de cursos
- Recomendações de vagas
- Insights gerados por IA
- Pull-to-refresh para gerar novas recomendações
- Logo do SkillBridge no header

#### 7. Plano de Estudos
Interface para gerar planos de estudos personalizados usando Inteligência Artificial.

**Campos do formulário:**
- Objetivo de carreira
- Nível atual (Iniciante, Intermediário, Avançado)
- Competências atuais (múltiplas)
- Tempo disponível por semana (horas)
- Prazo em meses
- Áreas de interesse (múltiplas)

**Funcionalidades:**
- Geração de plano via IA
- Exibição de plano estruturado com etapas
- Recursos sugeridos
- Métricas de sucesso
- Logo do SkillBridge no header

#### 8. Perfil
Tela de perfil do usuário com informações pessoais e opções de edição.

**Informações exibidas:**
- Avatar do usuário
- Nome completo
- Email
- Telefone (se cadastrado)
- Cidade e UF (se cadastrado)
- Objetivo de carreira (se cadastrado)
- Lista de competências

**Funcionalidades:**
- Edição de perfil (modal)
- Visualização de candidaturas
- Link para tela "Sobre o App"
- Botão de logout
- Logo do SkillBridge no header

#### 9. Sobre
Tela informativa sobre o aplicativo com detalhes técnicos.

**Informações exibidas:**
- Logo do SkillBridge
- Nome e tagline do app
- Versão do aplicativo
- Commit hash (para rastreabilidade)
- Data de build
- Descrição do SkillBridge
- Informações técnicas (framework, backend, IA)

**Funcionalidades:**
- Navegação de volta
- Informações atualizadas automaticamente via build

### Navegação

O aplicativo utiliza React Navigation com duas estruturas principais:

1. **Stack Navigator** - Para navegação entre telas principais
2. **Tab Navigator** - Para navegação entre seções principais (Dashboard, Recomendações, Vagas, Cursos, Plano, Perfil)

### Autenticação

O aplicativo utiliza autenticação baseada em JWT:

- Token armazenado localmente após login
- Token incluído automaticamente em todas as requisições
- Redirecionamento para login quando token expira ou é inválido
- Verificação de autenticação ao iniciar o app

## Gestão do Aplicativo

O SkillBridge Mobile permite que usuários comuns gerenciem completamente suas próprias informações através da interface do aplicativo.

### Gestão de Perfil do Usuário

Na tela **Perfil**, os usuários podem:

#### Visualizar Informações

- Nome completo
- Email
- Telefone (se cadastrado)
- Cidade e UF (se cadastrado)
- Objetivo de carreira (se cadastrado)
- Lista completa de competências

#### Editar Perfil

Através do botão "Editar Perfil", o usuário pode modificar:

- **Nome**: Nome completo
- **Telefone**: Número de telefone
- **Cidade**: Cidade de residência
- **UF**: Estado (sigla de 2 letras)
- **Objetivo de Carreira**: Objetivo profissional
- **Competências**: Adicionar ou remover competências

**Nota**: O email não pode ser alterado através do aplicativo. Para alterar o email, é necessário contatar um administrador ou usar a API diretamente.

#### Excluir Conta

O usuário pode excluir sua própria conta através do botão "Excluir Conta" na tela de perfil. Esta ação é irreversível e remove todos os dados do usuário do sistema.

#### Visualizar Candidaturas

Na tela de perfil, o usuário pode visualizar todas as suas candidaturas a vagas, incluindo:

- Vaga para a qual se candidatou
- Data da candidatura
- Status da candidatura

### Limitações do Usuário Comum

Usuários comuns (role USER) não podem:

- Criar, editar ou excluir vagas
- Criar, editar ou excluir cursos
- Gerenciar outros usuários
- Alterar permissões (roles) de outros usuários
- Acessar funcionalidades administrativas

### Gestão Administrativa

Funcionalidades administrativas (criar/editar vagas, cursos, gerenciar usuários) estão disponíveis apenas através da API REST, utilizando ferramentas como Swagger UI ou Postman. Consulte `../api/README.md` para mais informações sobre gestão administrativa.

## Como Executar

### Pré-requisitos

- **Node.js 18+** instalado
- **npm** ou **yarn** instalado
- **Expo CLI** (instalado globalmente ou via npx)
- Acesso à API SkillBridge (local ou produção)

### Instalação

```bash
# Navegar para a pasta do projeto
cd SkillBridge

# Instalar dependências
npm install
```

### Configuração da API

O aplicativo está configurado para usar as APIs de produção no Render por padrão:

- **API Principal (Java)**: `https://projetojavaskillbridge.onrender.com`
- **API IoT (Python)**: `https://projetoiotskillbridge.onrender.com`

As configurações estão em `src/config/api.ts`.

### Para Desenvolvimento Local

Se precisar usar uma API local, edite `src/config/api.ts`:

```typescript
// Para Android Emulator
return 'http://10.0.2.2:8080';

// Para iOS Simulator ou Web
return 'http://localhost:8080';
```

**Nota:** Certifique-se de que a API local está rodando antes de iniciar o app.

### Iniciar o Aplicativo

```bash
# Iniciar o servidor de desenvolvimento
npm start
```

Isso abrirá o Expo DevTools no navegador. Você pode:

- Pressionar `a` para abrir no Android Emulator
- Pressionar `i` para abrir no iOS Simulator
- Escanear o QR code com o app Expo Go no seu dispositivo físico

### Build para Produção

```bash
# Build para Android
npx expo build:android

# Build para iOS
npx expo build:ios
```

## Estrutura de Pastas

```
SkillBridge/
├── src/
│   ├── config/              # Configurações (API, build info)
│   ├── images/              # Imagens e assets
│   ├── navigation/          # Configuração de navegação
│   ├── pages/               # Telas do aplicativo
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Vagas.tsx
│   │   ├── Cursos.tsx
│   │   ├── Recomendacoes.tsx
│   │   ├── PlanoEstudos.tsx
│   │   ├── Perfil.tsx
│   │   └── Sobre.tsx
│   ├── services/            # Serviços de API
│   ├── types/               # Definições TypeScript
│   └── App.tsx              # Componente raiz
├── assets/                  # Assets do Expo
├── app.json                 # Configuração do Expo
├── package.json             # Dependências
└── README.md                # Este arquivo
```

## Integração com APIs

### API Principal (Java Spring Boot)

O aplicativo se comunica com a API Java para:

- Autenticação (login/registro)
- Gerenciamento de usuários
- Listagem de vagas e cursos
- Registro de candidaturas
- Obtenção de recomendações
- Cálculo de compatibilidade

### API IoT (Python FastAPI)

O aplicativo se comunica com a API Python para:

- Geração de planos de estudos personalizados com IA

### Tratamento de Erros

O aplicativo trata diversos cenários de erro:

- Erros de conexão com a API
- Erros de autenticação (token expirado)
- Erros de validação de formulários
- Timeouts de requisições
- Erros do servidor (500, 503, etc.)

Mensagens de erro são exibidas de forma amigável ao usuário.

## Funcionalidades de UX

- **Pull-to-Refresh**: Disponível em várias telas para atualizar dados
- **Loading States**: Indicadores de carregamento durante requisições
- **Empty States**: Mensagens quando não há dados para exibir
- **Validação de Formulários**: Feedback imediato ao usuário
- **Navegação Intuitiva**: Tab navigation para acesso rápido
- **Design Responsivo**: Adapta-se a diferentes tamanhos de tela

## Informações de Build

O aplicativo inclui informações de build que são exibidas na tela "Sobre":

- **Versão**: Definida em `app.json`
- **Commit Hash**: Gerado automaticamente durante o build
- **Data de Build**: Data de compilação do aplicativo

Essas informações são úteis para rastreabilidade e debugging.

## Troubleshooting

### Erro de conexão com API

- Verifique se a API está rodando
- Confirme a URL em `src/config/api.ts`
- Para Android Emulator, use `10.0.2.2` em vez de `localhost`
- Verifique sua conexão de internet

### Erro ao instalar dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm cache clean --force
npm install
```

### Problemas com Expo

```bash
# Limpar cache do Expo
npx expo start -c
```

### Erro de autenticação

- Verifique se o token JWT está sendo armazenado corretamente
- Confirme que a API está retornando tokens válidos
- Tente fazer logout e login novamente

### Problemas de navegação

- Certifique-se de que todas as telas estão registradas no navigator
- Verifique se os parâmetros de navegação estão corretos

---

**SkillBridge Mobile – Conectando talentos ao futuro da energia sustentável.**
