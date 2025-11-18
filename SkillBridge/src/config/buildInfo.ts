export const COMMIT_HASH = process.env.EXPO_PUBLIC_COMMIT_HASH || 
                           process.env.COMMIT_HASH || 
                           'N/A';

export const APP_VERSION = '1.0.0';

export const BUILD_DATE = new Date().toLocaleDateString('pt-BR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

