import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Profile from "./components/Profile";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const { loading, authenticated, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) return <LoadingScreen />;

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
