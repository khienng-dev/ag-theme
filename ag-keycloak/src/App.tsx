import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Profile from "./components/Profile";
import LoadingScreen from "./components/LoadingScreen";

const LOGIN_REDIRECT_LOCK_KEY = "ag-keycloak:login-redirecting";

export default function App() {
  const { loading, authenticated, init, login } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (loading) return;

    if (authenticated) {
      sessionStorage.removeItem(LOGIN_REDIRECT_LOCK_KEY);
      return;
    }

    if (sessionStorage.getItem(LOGIN_REDIRECT_LOCK_KEY) === "1") return;

    sessionStorage.setItem(LOGIN_REDIRECT_LOCK_KEY, "1");
    void login();
  }, [authenticated, loading, login]);

  if (loading) return <LoadingScreen />;
  if (!authenticated) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <Hero />
        {authenticated && <Profile />}
      </main>
    </div>
  );
}
