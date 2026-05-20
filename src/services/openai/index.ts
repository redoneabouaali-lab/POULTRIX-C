import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function openaiChat(
  messages: { role: string; content: string }[],
  model?: string
) {
  return client.chat.completions.create({
    model: model || "gpt-4o-mini",
    messages: messages as any,
    stream: true,
  });
}

export const openai = client;
