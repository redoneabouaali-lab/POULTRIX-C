import { COLORS } from "@/constants";
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center px-4 overflow-hidden" style={{ background: "#f8f8fa" }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(196,137,58,0.1) 0%, transparent 40%, rgba(245,237,227,0.08) 60%, transparent 100%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 400, height: 400, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(196,137,58,0.08) 0%, transparent 60%)", filter: "blur(60px)" }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={COLORS.aqua} strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/></svg>
            <span className="text-[10px] font-semibold tracking-[0.15em] font-brand" style={{ color: "#1a1a24" }}>POULTRIX</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#1a1a24" }}>Create your account</h1>
          <p className="text-sm" style={{ color: "#5A6A5A" }}>Start your free month — no credit card needed</p>
        </div>

        <div style={{ background: "#fff", borderRadius: "14px", padding: "1px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ borderRadius: "13px", padding: "20px" }}>
            <SignUp signInUrl="/login" fallbackRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none p-0",
                  headerTitle: "hidden", headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-[#f5f5f7] text-[#5a5a64] hover:bg-[#eeeef0] rounded-lg text-sm font-medium transition-all duration-200 h-10 border-0",
                  socialButtonsBlockButtonText: "text-[#5a5a64]",
                  formButtonPrimary: "rounded-lg font-semibold shadow-sm h-10 text-sm",
                  footerActionLink: "text-[#C4893A] hover:text-[#2D5541] font-medium text-sm",
                  formFieldInput: "bg-[#f5f5f7] border-0 text-[#1a1a24] placeholder:text-[#a0a0aa] rounded-lg text-sm h-10 focus:ring-1 focus:ring-[#C4893A]/30",
                  formFieldLabel: "text-[#5A6A5A] text-xs font-medium",
                  dividerLine: "bg-[#eeeef0]", dividerText: "text-[#a0a0aa] text-xs",
                  identityPreviewText: "text-[#5a5a64]", identityPreview: "bg-[#f5f5f7] rounded-lg",
                  otpCodeFieldInput: "bg-[#f5f5f7] text-[#1a1a24] rounded-lg",
                  alert: "rounded-lg bg-red-500/10 border-red-500/20 text-red-600",
                  alertText: "text-sm",
                },
              }}
            />
          </div>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: "#a0a0aa" }}>30 يوم مجاني &bull; إلغاء في أي وقت &bull; POULTRIX &copy; 2026</p>
      </div>
    </div>
  );
}
