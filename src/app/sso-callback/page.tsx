import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="flex gap-2">
        <span className="w-3 h-3 rounded-full animate-bounce" style={{ background: "#C4893A" }} />
        <span className="w-3 h-3 rounded-full animate-bounce" style={{ background: "#2D5541", animationDelay: "0.2s" }} />
        <span className="w-3 h-3 rounded-full animate-bounce" style={{ background: "#BF7A5A", animationDelay: "0.4s" }} />
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
