# SkillBridge API

Plataforma de capacitação profissional voltada à transição energética. A aplicação conecta talentos a cursos e vagas sustentáveis e utiliza IA generativa para sugerir próximos passos em requalificação.

## Stack Tecnológica

- **Java 21**
- **Maven 3.9+**
- **Spring Boot 3.5.7** (Web, Data JPA, Validation, Security, Cache, Actuator)
- **Springdoc OpenAPI** (Swagger)
- **Oracle Database 19c**
- **RabbitMQ** (opcional para eventos)

## Pré-requisitos

1. **Java 21** instalado
2. **Maven 3.9+** instalado
3. **Oracle Database** acessível
   - Scripts assumem usuário `RM557863`
   - Ver instruções em `../bancodedados/README.md`
4. **Servidor IOT Python** rodando (para planos de estudos)
   - Ver instruções em `../IOT/README.md`

## Configuração Inicial

### 1. Configurar Banco de Dados Oracle

Execute os scripts na ordem (em `../bancodedados/sql/`):

1. `create_tables.sql`
2. `functions.sql`
3. `packages.sql`
4. `triggers.sql`
5. `create_recomendacao_ia_table.sql` (para recomendações com IA)

Popular dados iniciais:

```sql
BEGIN
  pkg_usuarios.popular_dados_iniciais;
END;
/
COMMIT;
```

### 2. Configurar Variáveis de Ambiente

Edite `src/main/resources/application.properties`:

```properties
# Banco de Dados Oracle
spring.datasource.url=jdbc:oracle:thin:@//oracle.fiap.com.br:1521/ORCL
spring.datasource.username=${DB_USERNAME:RM557863}
spring.datasource.password=${DB_PASSWORD:sua-senha}

# JWT Secret (mínimo 32 caracteres)
security.jwt.secret=change-me-please-32-characters-minimum

# Gemini API (para recomendações com IA)
spring.ai.gemini.api-key=sua-chave-gemini-aqui
spring.ai.gemini.model=gemini-2.0-flash-exp

# Servidor IOT Python (para planos de estudos)
iot.service.url=http://localhost:8000
```

**Ou configure via variáveis de ambiente:**

- `DB_USERNAME`
- `DB_PASSWORD`
- `GEMINI_API_KEY`
- `IOT_SERVICE_URL`

### 3. Instalar Dependências

```bash
cd api
mvn clean install
```

## Como Executar

### Executar Localmente

```bash
cd api
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

### Verificar Saúde da API

```bash
curl http://localhost:8080/actuator/health
```

### Acessar Documentação Swagger

Abra no navegador: `http://localhost:8080/swagger-ui.html`

## Testes Automatizados

Execute os testes unitários:

```bash
mvn test
```

**Principais testes:**

- `UsuarioServiceTest` - Cadastro e chamada a `PKG_USUARIOS`
- `AplicacaoServiceTest` - Registro de candidatura via `PKG_VAGAS`
- `VagaServiceTest` - Cálculo de compatibilidade
- `RecommendationServiceTest` - Recomendações com IA

## Endpoints Principais

### Autenticação

- `POST /auth/register` - Registrar novo usuário (gera JWT)
- `POST /auth/login` - Login e obter token JWT

### Usuários

- `GET /api/v1/usuarios` - Listar usuários (paginado, cache)

### Vagas

- `GET /api/v1/vagas` - Listar vagas (paginado)
- `GET /api/v1/vagas/{id}/compatibilidade` - Calcular compatibilidade usuário × vaga
- `POST /api/v1/vagas` - Criar nova vaga

### Aplicações

- `POST /api/v1/aplicacoes` - Registrar candidatura (chama `PKG_VAGAS.REGISTRAR_APLICACAO`)
- `GET /api/v1/aplicacoes` - Listar aplicações

### Cursos

- `GET /api/v1/cursos` - Listar cursos (paginado)

### Recomendações com IA

- `POST /api/v1/ia/recomendacoes/{usuarioId}` - Gerar recomendações usando Gemini
- `GET /api/v1/ia/recomendacoes/{usuarioId}` - Buscar última recomendação

### Planos de Estudos (Integração IOT)

- `POST /api/v1/planos-estudos/gerar` - Gerar plano de estudos personalizado

**Todos os endpoints (exceto `/auth/**`, Swagger e actuator) requerem:\*\*

```
Authorization: Bearer <token-jwt>
```

## Coleção Postman

Importe `../postman/SkillBridge.postman_collection.json` no Postman:

1. Configure `{{base_url}}` = `http://localhost:8080`
2. Execute `Auth - Registrar usuário` → `Auth - Login`
3. Copie o token para `{{auth_token}}`
4. Teste os endpoints protegidos

## Integração com Oracle

A API chama procedures PL/SQL:

- **`PKG_USUARIOS.INSERIR_USUARIO`** - Cadastro de usuários
- **`PKG_VAGAS.REGISTRAR_APLICACAO`** - Registro de candidaturas
- **`PKG_VAGAS.CALCULAR_COMPATIBILIDADE`** - Cálculo de compatibilidade

Triggers de auditoria registram operações em `log_auditoria`.

## Integração com IOT (Deep Learning)

A API integra com o módulo Python para gerar planos de estudos:

**Endpoint:** `POST /api/v1/planos-estudos/gerar`

**Request:**

```json
{
  "objetivoCarreira": "Tornar-me desenvolvedor Java Sênior",
  "nivelAtual": "Intermediário",
  "competenciasAtuais": ["Java", "Spring Boot", "SQL"],
  "tempoDisponivelSemana": 15,
  "prazoMeses": 6,
  "areasInteresse": ["Microservices", "Cloud"]
}
```

**Configuração:** `iot.service.url=http://localhost:8000` (servidor Python deve estar rodando)

## Deploy em Produção

A aplicação está disponível em produção através do Render:

- **API Java (Spring Boot):** https://projetoiotskillbridge.onrender.com/
- **Servidor IoT (Python):** https://projetoiotskillbridge.onrender.com

### Documentação da API em Produção

- **Swagger UI:** https://projetoiotskillbridge.onrender.com/swagger-ui.html
- **Health Check:** https://projetoiotskillbridge.onrender.com/actuator/health

## Build e Deploy

### Gerar JAR

```bash
mvn clean package
```

### Executar JAR

```bash
java -jar target/skillbridge-api-0.0.1-SNAPSHOT.jar
```

### Deploy em Nuvem

1. Configure variáveis de ambiente:
   - `DB_USERNAME`, `DB_PASSWORD`
   - `GEMINI_API_KEY`
   - `IOT_SERVICE_URL`
   - `JWT_SECRET`
2. Garanta acesso ao Oracle (VPN/rede corporativa)
3. Inicie o servidor IOT Python separadamente

## Troubleshooting

### Erro de conexão com Oracle

- Verifique credenciais em `application.properties`
- Confirme acesso à rede/VPN
- Valide scripts SQL executados

### Erro 403 em endpoints protegidos

- Obtenha token via `/auth/login`
- Inclua header: `Authorization: Bearer <token>`

### Erro ao chamar serviço IOT

- Verifique se servidor Python está rodando na porta 8000
- Confirme `iot.service.url` em `application.properties`

## Estrutura do Projeto

```
api/
├── src/
│   ├── main/
│   │   ├── java/br/com/skillbridge/api/
│   │   │   ├── config/          # Configurações (Security, Cache, etc)
│   │   │   ├── controller/      # Controllers REST
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── exception/       # Tratamento de exceções
│   │   │   ├── model/           # Entidades JPA
│   │   │   ├── repository/      # Repositórios Spring Data
│   │   │   ├── security/        # JWT e autenticação
│   │   │   └── service/         # Lógica de negócio
│   │   └── resources/
│   │       ├── application.properties
│   │       └── messages*.properties  # i18n
│   └── test/                    # Testes unitários
└── pom.xml
```

---

**SkillBridge – conectando talentos, habilidades e oportunidades no futuro da energia.**
