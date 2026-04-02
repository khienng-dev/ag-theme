"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function AutoLogin() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("keycloak", { callbackUrl: "/" });
    }
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Đang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return null;
}
