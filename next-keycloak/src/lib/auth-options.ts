import type { AuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

const EXCLUDED_ROLES = [
  "offline_access",
  "uma_authorization",
  "default-roles-ag-ecommerce",
];

interface KeycloakProfile {
  realm_access?: { roles: string[] };
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: process.env.AUTH_KEYCLOAK_ID!,
          client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
          refresh_token: token.refreshToken ?? "",
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to refresh token");

    const refreshed = await response.json();

    return {
      ...token,
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      idToken: refreshed.id_token,
      expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Lần đầu login
      if (account && profile) {
        const keycloakProfile = profile as KeycloakProfile;
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          expiresAt: account.expires_at,
          preferred_username: keycloakProfile.preferred_username,
          given_name: keycloakProfile.given_name,
          family_name: keycloakProfile.family_name,
          roles:
            keycloakProfile.realm_access?.roles.filter(
              (r) => !EXCLUDED_ROLES.includes(r)
            ) ?? [],
        };
      }

      // Token còn hạn
      if (Date.now() < (token.expiresAt ?? 0) * 1000) {
        return token;
      }

      // Token hết hạn → refresh
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken ?? "";
      session.refreshToken = token.refreshToken ?? "";
      session.idToken = token.idToken ?? "";
      session.roles = token.roles ?? [];
      session.username = token.preferred_username ?? "";
      session.firstName = token.given_name ?? "";
      session.lastName = token.family_name ?? "";
      session.user = {
        ...session.user,
        name:
          token.name ??
          `${token.given_name ?? ""} ${token.family_name ?? ""}`.trim(),
        email: token.email ?? "",
        image: token.picture ?? "",
      };
      return session;
    },
  },
};