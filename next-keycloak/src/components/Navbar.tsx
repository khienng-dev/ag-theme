"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, Shield } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const authenticated = status === "authenticated";

  const handleLogout = async () => {
    // 1. Clear NextAuth session
    await signOut({ redirect: false });
    // 2. Redirect to Keycloak logout to kill SSO session
    window.location.href = "/api/logout";
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
      <div className="flex items-center gap-2 font-semibold">
        <Shield size={20} />
        <span>Keycloak</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        {authenticated && session?.user && (
          <span className="text-gray-500">
            <strong>{session.user.name || "User"}</strong>
          </span>
        )}
        {authenticated ? (
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 cursor-pointer"
          >
            <LogOut size={15} />
            Logout
          </button>
        ) : (
          <button
            onClick={() => signIn("keycloak")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 cursor-pointer"
          >
            <LogIn size={15} />
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
