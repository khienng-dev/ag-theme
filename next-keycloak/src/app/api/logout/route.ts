import { NextResponse } from "next/server";

export async function GET() {
  const keycloakIssuer = process.env.KEYCLOAK_ISSUER!;
  const postLogoutRedirect = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const params = new URLSearchParams({
    client_id: process.env.KEYCLOAK_CLIENT_ID!,
    post_logout_redirect_uri: postLogoutRedirect,
  });

  const url = `${keycloakIssuer}/protocol/openid-connect/logout?${params.toString()}`;

  return NextResponse.json({ url });
}
