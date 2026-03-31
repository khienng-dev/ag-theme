import { useAuthStore } from "../store/authStore";
import { User, Mail, FileText } from "lucide-react";

export default function Profile() {
  const { authenticated, userProfile } = useAuthStore();

  if (!authenticated || !userProfile) return null;

  const infoItems = [
    { label: "Username", value: userProfile.username, icon: <User size={14} /> },
    { label: "Email", value: userProfile.email, icon: <Mail size={14} /> },
    { label: "First Name", value: userProfile.firstName, icon: <FileText size={14} /> },
    { label: "Last Name", value: userProfile.lastName, icon: <FileText size={14} /> },
  ];

  const displayName = [userProfile.firstName, userProfile.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <section>
      <div className="border border-gray-200 rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          {userProfile.picture ? (
            <img
              src={userProfile.picture}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
              {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
            </div>
          )}
          <div>
            <p className="font-medium text-sm">{displayName}</p>
            <p className="text-xs text-gray-400">{userProfile.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0 text-sm"
            >
              <span className="text-gray-400 shrink-0">{item.icon}</span>
              <span className="text-gray-400 w-24 shrink-0 text-xs">{item.label}</span>
              <span className="font-medium">{item.value || "N/A"}</span>
            </div>
          ))}
        </div>
        {/* {roles.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h3 className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <BadgeCheck size={12} /> Roles
            </h3>
            <div className="flex gap-1.5 flex-wrap">
              {roles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 bg-blue-50 rounded text-xs text-blue-600"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </section>
  );
}
