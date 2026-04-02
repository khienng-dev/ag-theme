import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    roles?: string[];
    username?: string;
    firstName?: string;
    lastName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?: number;
    roles?: string[];
    given_name?: string;
    family_name?: string;
    preferred_username?: string;
  }
}
