import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
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
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.idToken = token.idToken as string;
      session.roles = (token.roles as string[]) ?? [];
      session.user = {
        ...session.user,
        name:
          (token.name as string) ??
          `${token.given_name ?? ""} ${token.family_name ?? ""}`.trim(),
        email: token.email as string,
        image: token.picture as string,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
