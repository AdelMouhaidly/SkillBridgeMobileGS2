const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getCommitHash() {
  try {
    const commitHash = execSync('git rev-parse --short HEAD', { 
      encoding: 'utf-8',
      cwd: path.join(__dirname, '..')
    }).trim();
    return commitHash;
  } catch (error) {
    console.warn('Nao foi possivel obter o hash do commit:', error.message);
    return 'N/A';
  }
}

function getRemoteUrl() {
  try {
    const remoteUrl = execSync('git remote get-url fiap', { 
      encoding: 'utf-8',
      cwd: path.join(__dirname, '..')
    }).trim();
    return remoteUrl;
  } catch (error) {
    try {
      const remoteUrl = execSync('git remote get-url origin', { 
        encoding: 'utf-8',
        cwd: path.join(__dirname, '..')
      }).trim();
      return remoteUrl;
    } catch (e) {
      return 'N/A';
    }
  }
}

const commitHash = getCommitHash();
const remoteUrl = getRemoteUrl();

const buildInfoContent = `export const COMMIT_HASH = '${commitHash}';
export const APP_VERSION = '1.0.0';
export const BUILD_DATE = '${new Date().toLocaleDateString('pt-BR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})}';
`;

const buildInfoPath = path.join(__dirname, '../src/config/buildInfo.ts');
fs.writeFileSync(buildInfoPath, buildInfoContent, 'utf-8');

if (commitHash !== 'N/A') {
  console.log(`Commit hash atualizado: ${commitHash}`);
  if (remoteUrl.includes('fiap') || remoteUrl.includes('FIAP')) {
    console.log(`Repositorio: ${remoteUrl}`);
  }
} else {
  console.log('Usando hash padrao "N/A"');
}

