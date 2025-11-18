import { Platform } from 'react-native';

const getApiUrl = () => {
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  
  return 'http://localhost:8080';
};

export const API_URL = getApiUrl();
