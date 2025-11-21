type LogoutCallback = () => void;

class AuthManager {
  private static instance: AuthManager;
  private logoutCallbacks: LogoutCallback[] = [];

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  onLogout(callback: LogoutCallback) {
    this.logoutCallbacks.push(callback);
    // Retorna função para remover o listener
    return () => {
      this.logoutCallbacks = this.logoutCallbacks.filter(cb => cb !== callback);
    };
  }

  logout() {
    this.logoutCallbacks.forEach(callback => callback());
  }
}

export default AuthManager.getInstance();

