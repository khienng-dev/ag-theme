import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Profile from "@/components/Profile";
import AutoLogin from "@/components/AutoLogin";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AutoLogin />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <Hero />
        <Profile />
      </main>
    </div>
  );
}
