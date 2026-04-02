import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  const keycloakIssuer = process.env.KEYCLOAK_ISSUER!;
  const postLogoutRedirect = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Build Keycloak logout URL
  const params = new URLSearchParams({
    client_id: process.env.KEYCLOAK_CLIENT_ID!,
    post_logout_redirect_uri: postLogoutRedirect,
  });

  // id_token_hint is required by Keycloak 18+ for post_logout_redirect_uri
  if (session?.idToken) {
    params.set("id_token_hint", session.idToken);
  }

  const url = `${keycloakIssuer}/protocol/openid-connect/logout?${params.toString()}`;

  // Return the URL as JSON so client can signOut first, then redirect
  return NextResponse.json({ url });
}
