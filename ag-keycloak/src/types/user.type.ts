export interface UserProfile {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

export interface AuthState {
  authenticated: boolean;
  loading: boolean;
  error: string | null;
  userProfile: UserProfile | null;
  roles: string[];

  init: () => Promise<void>;
  login: () => void;
  logout: () => void;
  getToken: () => string | undefined;
}