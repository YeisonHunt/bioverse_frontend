export interface User {
    id: number;
    username: string;
    role: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
  }