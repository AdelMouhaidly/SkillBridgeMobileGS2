# SkillBridge – Banco de Dados (Oracle + MongoDB)

Projeto Global Solution FIAP 2025/2 – Tema **"O Futuro do Trabalho"**.  
Implementa o backend de dados da plataforma **SkillBridge** com Oracle Database (relacional) e MongoDB (NoSQL).

## Sobre o Banco de Dados

O SkillBridge utiliza uma arquitetura de banco de dados híbrida, combinando Oracle Database para dados relacionais estruturados e MongoDB para armazenamento de dados não estruturados. O Oracle Database gerencia todas as entidades principais da aplicação (usuários, vagas, cursos, aplicações), enquanto o MongoDB armazena recomendações e análises geradas por IA.

### Arquitetura de Dados

- **Oracle Database 19c**: Banco de dados relacional principal
  - Tabelas normalizadas em 3FN
  - Packages PL/SQL para lógica de negócio
  - Triggers de auditoria
  - Funções utilitárias
- **MongoDB**: Banco de dados NoSQL para dados não estruturados
  - Armazenamento de recomendações de IA
  - Análises e insights gerados

## Estrutura de Pastas

```
bancodedados/
├── sql/            # Scripts Oracle (DDL, packages, funções, triggers, export)
├── nosql/          # Dataset JSON, script de importação e guia do mongosh
├── docs/           # Diagramas lógico e físico (PDF)
└── README.md       # Este arquivo
```

## Configuração Inicial - Oracle Database

### Pré-requisitos

- Acesso ao Oracle Database (ex: `oracle.fiap.com.br:1521/ORCL`)
- Usuário com permissões para criar tabelas, packages e triggers
- SQL Developer ou ferramenta similar (DBeaver, Oracle SQL*Plus)
- Conhecimento básico de SQL e PL/SQL

### Passo a Passo

#### 1. Executar Scripts SQL na Ordem

Conecte ao schema Oracle e execute os scripts na ordem indicada:

1. **`sql/create_tables.sql`** - Criação de todas as tabelas do sistema
   - Define estrutura de dados principal
   - Cria constraints e foreign keys
   - Define índices para performance

2. **`sql/functions.sql`** - Funções PL/SQL utilitárias
   - Funções para cálculos e transformações
   - Funções auxiliares para geração de JSON

3. **`sql/packages.sql`** - Packages PL/SQL (`PKG_USUARIOS`, `PKG_VAGAS`)
   - Lógica de negócio encapsulada
   - Procedures para operações complexas
   - Validações e regras de negócio

4. **`sql/triggers.sql`** - Triggers de auditoria
   - Registro automático de operações
   - Logs de alterações em tabelas críticas

5. **`sql/create_recomendacao_ia_table.sql`** - Tabela para recomendações com IA
   - Armazenamento de recomendações geradas
   - Histórico de análises de IA

6. **`sql/dataset_export.sql`** - Procedure para exportar dataset JSON
   - Exportação de dados para MongoDB
   - Geração de JSON estruturado

**Importante:** Execute na ordem indicada para evitar erros de dependência. Cada script depende dos anteriores.

#### 2. Popular Dados Iniciais

Execute a procedure para popular dados temáticos de exemplo:

```sql
BEGIN
  pkg_usuarios.popular_dados_iniciais;
END;
/
COMMIT;
```

Esta procedure cria:
- Usuários de exemplo
- Vagas de exemplo relacionadas a energia sustentável
- Cursos de capacitação profissional
- Relacionamentos entre entidades

**Verificar dados populados:**

```sql
SELECT COUNT(*) FROM usuario;
SELECT COUNT(*) FROM vaga;
SELECT COUNT(*) FROM curso;
SELECT COUNT(*) FROM aplicacao;
```

#### 3. Exportar Dataset JSON (Opcional)

Para exportar dados para MongoDB:

```sql
SET SERVEROUTPUT ON;
EXEC exportar_dataset_json;
```

Copie o output JSON gerado e salve em `nosql/dataset.json` (já incluso no projeto).

**Uso:** O dataset JSON pode ser importado no MongoDB para análises adicionais ou backup.

#### 4. Testar Funções e Triggers

**Testar funções:**

```sql
-- Gerar JSON manual
SELECT fn_gerar_json_manual FROM dual;

-- Calcular compatibilidade entre competências
SELECT fn_calcular_compatibilidade('Java, SQL', 'Java, Cloud') FROM dual;
```

**Testar triggers de auditoria:**

```sql
-- Inserir um usuário de teste
INSERT INTO usuario (id, nome, email, senha) 
VALUES ('test-123', 'Teste', 'teste@email.com', 'senha123');

-- Verificar log de auditoria
SELECT * FROM log_auditoria ORDER BY data_evento DESC;
```

Os triggers devem registrar automaticamente a operação na tabela `log_auditoria`.

## Estrutura do Banco de Dados Oracle

### Tabelas Principais

- **usuario**: Dados dos usuários da plataforma
- **vaga**: Vagas de emprego disponíveis
- **curso**: Cursos de capacitação
- **aplicacao**: Candidaturas de usuários a vagas
- **log_auditoria**: Logs de operações para auditoria
- **recomendacao_ia**: Recomendações geradas por IA

### Packages PL/SQL

#### PKG_USUARIOS

Gerencia operações relacionadas a usuários:

- **INSERIR_USUARIO**: Cadastra novo usuário com validações
- **popular_dados_iniciais**: Popula dados de exemplo

#### PKG_VAGAS

Gerencia operações relacionadas a vagas:

- **REGISTRAR_APLICACAO**: Registra candidatura de usuário a vaga
- **CALCULAR_COMPATIBILIDADE**: Calcula compatibilidade entre usuário e vaga

### Funções

- **fn_gerar_json_manual**: Gera JSON estruturado para exportação
- **fn_calcular_compatibilidade**: Calcula percentual de compatibilidade entre competências

### Triggers

Triggers de auditoria registram automaticamente:

- INSERT em `usuario`, `vaga`, `curso`, `aplicacao`
- UPDATE em `usuario`, `vaga`
- DELETE em `vaga`, `curso`

Todos os logs são salvos em `log_auditoria` com informações de:
- Tipo de operação (INSERT, UPDATE, DELETE)
- Tabela afetada
- Dados antigos e novos (para UPDATE)
- Data e hora do evento
- Usuário que executou a operação

## Configuração - MongoDB (Opcional)

### Pré-requisitos

- MongoDB Server instalado e rodando (`mongod`)
- `mongosh` (MongoDB Shell) ou MongoDB Compass instalado

### Passo a Passo

1. **Iniciar MongoDB Server:**

   ```bash
   mongod
   ```

   Ou como serviço no Windows/Linux.

2. **Abrir MongoDB Shell:**

   ```bash
   mongosh
   ```

3. **Importar Dataset:**

   Siga o guia detalhado: `nosql/import_mongosh.md`

   Ou execute diretamente:

   ```bash
   mongoimport --db skillbridge --collection recomendacoes --file nosql/dataset.json --jsonArray
   ```

4. **Validar Importação:**

   ```javascript
   use skillbridge;
   db.recomendacoes.find().pretty();
   db.recomendacoes.count();
   ```

### Estrutura no MongoDB

O dataset JSON contém recomendações e análises estruturadas que podem ser consultadas de forma flexível no MongoDB.

## Diagramas

- **Modelo Lógico**: `docs/modelo-logico.pdf`
  - Representa o modelo conceitual em 3FN
  - Mostra relacionamentos entre entidades
  - Notação IE (Information Engineering)

- **Modelo Físico**: `docs/modelo-relacional.pdf`
  - Representa a implementação física no Oracle
  - Inclui tipos de dados, constraints e índices
  - Gerado no Oracle Data Modeler

## Integração com Aplicação Java

A API Java Spring Boot consome as procedures e funções via JDBC:

### Procedures Principais Utilizadas

- **`PKG_USUARIOS.INSERIR_USUARIO`** - Chamada durante cadastro de usuários
- **`PKG_VAGAS.REGISTRAR_APLICACAO`** - Chamada ao registrar candidatura
- **`PKG_VAGAS.CALCULAR_COMPATIBILIDADE`** - Chamada para calcular compatibilidade

### Funções Utilizadas

- **`fn_gerar_json_manual`** - Para exportação de dados
- **`fn_calcular_compatibilidade`** - Para cálculos de compatibilidade

### Exemplo de Uso na API Java

```java
// Exemplo de chamada a procedure
String sql = "{call PKG_VAGAS.REGISTRAR_APLICACAO(?, ?, ?)}";
CallableStatement stmt = connection.prepareCall(sql);
stmt.setString(1, usuarioId);
stmt.setString(2, vagaId);
stmt.setString(3, mensagem);
stmt.execute();
```

## Scripts Disponíveis

| Script                             | Descrição                                  |
| ---------------------------------- | ------------------------------------------ |
| `create_tables.sql`                | Criação de todas as tabelas                |
| `functions.sql`                    | Funções PL/SQL utilitárias                 |
| `packages.sql`                     | Packages `PKG_USUARIOS` e `PKG_VAGAS`      |
| `triggers.sql`                     | Triggers de auditoria                      |
| `create_recomendacao_ia_table.sql` | Tabela para armazenar recomendações com IA |
| `dataset_export.sql`               | Procedure para exportar dados em JSON      |

## Manutenção e Monitoramento

### Verificar Logs de Auditoria

```sql
-- Últimas 10 operações
SELECT * FROM log_auditoria 
ORDER BY data_evento DESC 
FETCH FIRST 10 ROWS ONLY;

-- Operações por tipo
SELECT tipo_operacao, COUNT(*) 
FROM log_auditoria 
GROUP BY tipo_operacao;

-- Operações por tabela
SELECT tabela_afetada, COUNT(*) 
FROM log_auditoria 
GROUP BY tabela_afetada;
```

### Verificar Integridade dos Dados

```sql
-- Verificar foreign keys
SELECT * FROM usuario u
WHERE NOT EXISTS (
    SELECT 1 FROM aplicacao a 
    WHERE a.usuario_id = u.id
) AND EXISTS (
    SELECT 1 FROM aplicacao a2 
    WHERE a2.usuario_id = u.id
);

-- Contar registros por tabela
SELECT 'usuario' as tabela, COUNT(*) as total FROM usuario
UNION ALL
SELECT 'vaga', COUNT(*) FROM vaga
UNION ALL
SELECT 'curso', COUNT(*) FROM curso
UNION ALL
SELECT 'aplicacao', COUNT(*) FROM aplicacao;
```

### Backup e Restore

Para backup do Oracle:

```bash
# Exportar schema completo
expdp RM557863/password@ORCL schemas=RM557863 directory=DATA_PUMP_DIR dumpfile=skillbridge_backup.dmp

# Importar backup
impdp RM557863/password@ORCL schemas=RM557863 directory=DATA_PUMP_DIR dumpfile=skillbridge_backup.dmp
```

## Troubleshooting

### Erro ao executar scripts

- Verifique permissões do usuário Oracle (CREATE TABLE, CREATE PROCEDURE, CREATE TRIGGER)
- Confirme ordem de execução dos scripts
- Verifique sintaxe SQL no SQL Developer
- Verifique se não há objetos com mesmo nome já existentes

### Erro ao popular dados

- Execute `pkg_usuarios.popular_dados_iniciais` novamente
- Verifique constraints e foreign keys
- Verifique se há dados duplicados
- Confirme que todas as tabelas foram criadas corretamente

### Triggers não funcionando

- Verifique se `triggers.sql` foi executado completamente
- Confirme permissões para criar triggers
- Verifique se tabela `log_auditoria` existe
- Teste inserindo um registro manualmente e verificando o log

### Erro de compatibilidade de versão

- Certifique-se de usar Oracle Database 19c ou superior
- Verifique sintaxe específica da versão do Oracle
- Algumas funções podem variar entre versões

### Problemas de performance

- Verifique se índices foram criados corretamente
- Analise planos de execução de queries lentas
- Considere particionamento para tabelas grandes
- Monitore uso de espaço e estatísticas

## Evidências Obrigatórias

Para o projeto Global Solution, as seguintes evidências são necessárias:

- Scripts SQL/PLSQL completos e funcionais
- Arquivo `nosql/dataset.json` e `mongo_import.js`
- Guia `nosql/import_mongosh.md` com instruções
- Diagramas em PDF (`docs/`)
- Vídeo demonstrativo (gravar separadamente)
- Documentação de procedures e funções

---

**Autor:** Afonso (Equipe SkillBridge) – 2025/2.

**SkillBridge – Banco de dados robusto e escalável para conectar talentos a oportunidades.**
