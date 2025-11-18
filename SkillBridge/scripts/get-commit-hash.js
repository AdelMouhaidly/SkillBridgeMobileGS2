/**
 * Script para obter o hash do commit atual
 * Pode ser executado durante o build para injetar o hash no app
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Tenta obter o hash do commit atual
  const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  
  // Cria o conteúdo do arquivo de build info
  const buildInfoContent = `/**
 * Informações de Build e Commit
 * Gerado automaticamente durante o build
 */

export const COMMIT_HASH = '${commitHash}';
export const APP_VERSION = '1.0.0';
export const BUILD_DATE = '${new Date().toLocaleDateString('pt-BR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})}';
`;

  // Escreve o arquivo
  const buildInfoPath = path.join(__dirname, '../src/config/buildInfo.ts');
  fs.writeFileSync(buildInfoPath, buildInfoContent, 'utf-8');
  
  console.log(`✅ Commit hash atualizado: ${commitHash}`);
} catch (error) {
  console.warn('⚠️  Não foi possível obter o hash do commit:', error.message);
  console.log('📝 Usando hash padrão "N/A"');
}

