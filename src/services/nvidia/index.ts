import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "",
  baseURL: process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1",
});

export async function nvidiaChat(
  messages: { role: string; content: string }[],
  model?: string
) {
  return client.chat.completions.create({
    model: model || process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct",
    messages: messages as any,
    stream: true,
  });
}

export async function nvidiaVisionChat(
  messages: { role: string; content: any }[],
  model?: string
) {
  return client.chat.completions.create({
    model: model || process.env.NVIDIA_VISION_MODEL || "meta/llama-3.2-11b-vision-instruct",
    messages: messages as any,
    stream: true,
  });
}
