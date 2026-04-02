import type { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "placeholder",
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;
        token.roles =
          (profile as Record<string, unknown>)?.realm_access !== undefined
            ? (
                (profile as Record<string, unknown>).realm_access as {
                  roles: string[];
                }
              ).roles?.filter(
                (r: string) =>
                  ![
                    "offline_access",
                    "uma_authorization",
                    "default-roles-ag-ecommerce",
                  ].includes(r)
              )
            : [];
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken as string;
      (session as any).refreshToken = token.refreshToken as string;
      (session as any).idToken = token.idToken as string;
      (session as any).roles = (token.roles as string[]) ?? [];
      session.user = {
        ...session.user,
        name:
          (token.name as string) ??
          `${(token as any).given_name ?? ""} ${(token as any).family_name ?? ""}`.trim(),
        email: token.email as string,
        image: token.picture as string,
      };
      return session;
    },
  },
};
