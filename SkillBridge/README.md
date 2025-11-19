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

O app está configurado para usar as APIs de produção no Render:

- **API Principal (Java)**: `https://projetojavaskillbridge.onrender.com`
- **API IoT (Python)**: `https://projetoiotskillbridge.onrender.com`

### Para desenvolvimento local

Se precisar usar uma API local, você pode:

1. **Usar variável de ambiente**:
   ```bash
   export API_URL=http://localhost:8080
   npm start
   ```

2. **Ou editar diretamente** `src/config/api.ts`:
   ```typescript
   return 'http://10.0.2.2:8080'; // Android Emulator
   // ou
   return 'http://localhost:8080'; // iOS Simulator / Web
   ```

## Commit Hash

Último commit: `37e8f0f`
