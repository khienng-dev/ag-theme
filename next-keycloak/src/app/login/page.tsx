import { signIn } from "@/auth";
import { Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield size={32} className="text-blue-600" />
          <h1 className="text-2xl font-semibold">Next Keycloak</h1>
        </div>
        <p className="text-gray-500 mb-8 text-sm">
          Sign in with your Keycloak account to continue
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("keycloak", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Sign in with Keycloak
          </button>
        </form>
      </div>
    </div>
  );
}
