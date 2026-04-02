"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, Shield } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const authenticated = status === "authenticated";
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // 1. Get Keycloak logout URL while session is still active (has idToken)
      const res = await fetch("/api/logout");

      if (!res.ok) {
        throw new Error("Failed to prepare logout URL");
      }

      const { url } = (await res.json()) as { url?: string };

      if (!url) {
        throw new Error("Missing logout URL");
      }

      // 2. Clear NextAuth session
      await signOut({ redirect: false });

      // 3. Redirect to Keycloak logout (kills SSO session)
      window.location.href = url;
    } catch {
      setIsLoggingOut(false);
    }
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
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 cursor-pointer"
          >
            <LogOut size={15} />
            {isLoggingOut ? "Logging out..." : "Logout"}
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
