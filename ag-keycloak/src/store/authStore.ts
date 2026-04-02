import { create } from "zustand";
import keycloak from "../keycloak";
import { AuthState, UserProfile } from "../types/user.type";

let initPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  loading: true,
  error: null,
  userProfile: null,
  roles: [],

  init: async () => {
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        const auth = await keycloak.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
          checkLoginIframe: false,
        });

        if (auth) {
          let profile: UserProfile;
          try {
            const kp = await keycloak.loadUserProfile();
            profile = {
              username: kp.username,
              email: kp.email,
              firstName: kp.firstName,
              lastName: kp.lastName,
              picture: (kp.attributes?.picture as string[])?.[0],
            };
          } catch {
            profile = {
              username: keycloak.tokenParsed?.preferred_username,
              email: keycloak.tokenParsed?.email,
              firstName: keycloak.tokenParsed?.given_name,
              lastName: keycloak.tokenParsed?.family_name,
              picture: (keycloak.tokenParsed?.picture as string[])?.[0],
            };
          }

          const roles =
            keycloak.tokenParsed?.realm_access?.roles?.filter(
              (r: string) =>
                ![
                  "offline_access",
                  "uma_authorization",
                  "default-roles-ecommerce-app",
                ].includes(r),
            ) ?? [];

          set({
            authenticated: true,
            userProfile: profile,
            roles,
            loading: false,
          });
        } else {
          set({ loading: false });
        }
      } catch (err) {
        console.error("Keycloak init failed:", err);
        set({
          error: "Failed to connect to authentication server.",
          loading: false,
        });
      }
    })();

    return initPromise;
  },

  login: () => keycloak.login(),
  logout: () => keycloak.logout({ redirectUri: window.location.origin }),
  getToken: () => keycloak.token,
}));
