import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3 text-gray-500">
      <Loader2 size={36} className="animate-spin" />
      <p className="text-sm">Loading...</p>
    </div>
  );
}
