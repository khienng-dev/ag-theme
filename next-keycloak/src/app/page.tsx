import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Profile from "@/components/Profile";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
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
