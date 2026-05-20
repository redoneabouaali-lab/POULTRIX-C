export const env = {
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000/api",
  jwtSecret: process.env.JWT_SECRET || "dajaj-prod-jwt-secret-rotate-in-production",
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
    secretKey: process.env.CLERK_SECRET_KEY || "",
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/login",
    signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up",
    signInForceRedirectUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL || "/dashboard",
    signUpForceRedirectUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL || "/dashboard",
  },
  nvidia: {
    apiKey: process.env.NVIDIA_API_KEY || "",
    baseUrl: process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1",
    model: process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct",
    visionModel: process.env.NVIDIA_VISION_MODEL || "meta/llama-3.2-11b-vision-instruct",
  },
  database: {
    url: process.env.DATABASE_URL || "",
  },
} as const;
