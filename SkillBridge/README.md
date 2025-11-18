# SkillBridge - App Mobile

Aplicativo React Native para a plataforma SkillBridge.

## Tecnologias

- React Native
- TypeScript
- Expo
- Axios
- React Navigation

## Telas

1. **Login** - Autenticação com JWT
2. **Registro** - Cadastro de novos usuários  
3. **Dashboard** - Visão geral
4. **Vagas** - Listagem de vagas
5. **Cursos** - Catálogo de cursos
6. **Perfil** - Dados do usuário
7. **Sobre** - Informações do app (com hash do commit)

## Como Rodar

```bash
# Instalar dependências
npm install

# Iniciar o app
npm start
```

## Configuração da API

Edite `src/config/api.ts` para configurar a URL da API:

```typescript
export const API_URL = 'http://SEU_IP:8080';
```

## Commit Hash

Último commit: `37e8f0f`
