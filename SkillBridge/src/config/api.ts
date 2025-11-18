// Para Android Emulator, use: http://10.0.2.2:8080
// Para iOS Simulator, use: http://localhost:8080
// Para dispositivo físico, use o IP da sua máquina: http://192.168.x.x:8080
// Exemplo: http://192.168.1.100:8080

// Detecta automaticamente o ambiente
import { Platform } from 'react-native';

const getApiUrl = () => {
  // Se estiver definido nas variáveis de ambiente, usa
  // Para definir: export API_URL=http://seu-ip:8080
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  
  // Para Android Emulator
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }
  
  // Para iOS Simulator ou Web
  return 'http://localhost:8080';
};

export const API_URL = getApiUrl();
