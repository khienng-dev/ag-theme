import { NextResponse } from "next/server";

export async function GET() {
  const keycloakIssuer = process.env.KEYCLOAK_ISSUER!;
  const postLogoutRedirect = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Redirect to Keycloak's end_session_endpoint to kill the SSO session
  const keycloakLogoutUrl = `${keycloakIssuer}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirect)}&client_id=${process.env.KEYCLOAK_CLIENT_ID}`;

  return NextResponse.redirect(keycloakLogoutUrl);
}
