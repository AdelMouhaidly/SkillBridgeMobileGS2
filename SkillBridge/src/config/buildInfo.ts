/**
 * Informações de Build e Commit
 * Este arquivo pode ser gerado automaticamente durante o build
 */

// Hash do commit atual - pode ser injetado via variável de ambiente ou script de build
export const COMMIT_HASH = process.env.EXPO_PUBLIC_COMMIT_HASH || 
                           process.env.COMMIT_HASH || 
                           'N/A';

// Versão do app
export const APP_VERSION = '1.0.0';

// Data de build
export const BUILD_DATE = new Date().toLocaleDateString('pt-BR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

