import { Platform } from 'react-native';

const getApiUrl = () => {
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  
  return 'https://projetojavaskillbridge.onrender.com';
};

export const API_URL = getApiUrl();

export const IOT_API_URL = 'https://projetoiotskillbridge.onrender.com';
