import { useAuthStore } from "../store/authStore";
import { LogIn, LogOut, Shield } from "lucide-react";

export default function Navbar() {
  const { authenticated, userProfile, login, logout } = useAuthStore();

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
      <div className="flex items-center gap-2 font-semibold">
        <Shield size={20} />
        <span>Keycloak</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        {authenticated && userProfile && (
          <span className="text-gray-500">
            <strong>{userProfile.firstName + " " + userProfile.lastName || userProfile.username || "User"}</strong>
          </span>
        )}
        {authenticated ? (
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 cursor-pointer"
          >
            <LogOut size={15} />
            Logout
          </button>
        ) : (
          <button
            onClick={login}
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
