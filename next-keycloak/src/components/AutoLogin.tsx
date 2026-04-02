"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

const AUTO_LOGIN_LOCK_KEY = "next-keycloak:auto-login";
const AUTO_LOGIN_LOCK_TTL_MS = 3_000;

export default function AutoLogin() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      sessionStorage.removeItem(AUTO_LOGIN_LOCK_KEY);
      return;
    }

    if (status !== "unauthenticated") return;

    const lastAttemptAt = Number(sessionStorage.getItem(AUTO_LOGIN_LOCK_KEY));
    const now = Date.now();

    if (Number.isFinite(lastAttemptAt) && now - lastAttemptAt < AUTO_LOGIN_LOCK_TTL_MS) {
      const retryIn = AUTO_LOGIN_LOCK_TTL_MS - (now - lastAttemptAt);
      const timer = window.setTimeout(() => {
        sessionStorage.setItem(AUTO_LOGIN_LOCK_KEY, String(Date.now()));
        void signIn("keycloak", { callbackUrl: "/" });
      }, retryIn);
      return () => window.clearTimeout(timer);
    }

    sessionStorage.setItem(AUTO_LOGIN_LOCK_KEY, String(now));
    void signIn("keycloak", { callbackUrl: "/" });
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
