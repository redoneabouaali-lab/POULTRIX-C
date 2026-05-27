import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#f8f8fa" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(600px circle at 50% 30%, rgba(196,137,58,0.08) 0%, transparent 60%)",
      }} />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: "#f0f0f2" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C4893A" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-[11px] font-semibold tracking-widest" style={{ color: "#1a1a24" }}>POULTRIX</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#1a1a24" }}>Welcome back</h1>
          <p className="text-sm mt-1.5" style={{ color: "#8a8a96" }}>Sign in to your dashboard</p>
        </div>

        <div className="rounded-xl p-6" style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02)" }}>
          <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none p-0",
                header: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "w-full bg-[#f5f5f7] hover:bg-[#eeeef0] rounded-lg text-sm font-medium h-11 border-0 transition-colors",
                socialButtonsBlockButtonText: "text-[#5a5a64] font-normal",
                socialButtonsIconBox: "mr-2",
                divider: "my-5",
                dividerLine: "bg-[#e8e8ec]",
                dividerText: "text-[#b0b0b8] text-xs",
                form: "space-y-4",
                formFieldRow: "space-y-4",
                formField: "space-y-1.5",
                formFieldLabel: "text-[#5a5a64] text-xs font-medium",
                formFieldInput: "bg-[#f5f5f7] border-0 text-[#1a1a24] placeholder:text-[#b0b0b8] rounded-lg text-sm h-11 px-4 focus:ring-1 focus:ring-[#C4893A]/30 focus:bg-white transition-all",
                formButtonPrimary: "w-full bg-[#1a1a24] hover:bg-[#2a2a34] text-white rounded-lg font-semibold h-11 text-sm transition-colors shadow-none",
                footerAction: "mt-5 text-center",
                footerActionText: "text-sm text-[#8a8a96]",
                footerActionLink: "text-[#C4893A] hover:text-[#a06e2e] font-medium text-sm",
                identityPreviewText: "text-[#5a5a64] text-sm",
                identityPreview: "bg-[#f5f5f7] rounded-lg p-3",
                otpCodeFieldInput: "bg-[#f5f5f7] text-[#1a1a24] rounded-lg",
                alert: "rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3",
                alertText: "text-sm",
                profileSection: "p-0",
                profileSectionTitle: "text-xs font-semibold text-[#8a8a96] uppercase tracking-wider",
                userButtonPopoverCard: "rounded-xl shadow-lg border-0",
                userButtonPopoverActionButton: "text-sm",
              },
            }}
          />
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: "#b0b0b8" }}>
          POULTRIX &copy; 2026
        </p>
      </div>
    </div>
  );
}
