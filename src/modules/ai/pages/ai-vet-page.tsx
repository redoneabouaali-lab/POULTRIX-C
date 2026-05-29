"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "@/constants";
import { Send, Image, Mic, Square, Bot, User, Sparkles, Volume2, ShoppingCart, Bird, HeartPulse, Package, Receipt, ArrowUpDown, Wheat, Egg, Stethoscope } from "lucide-react";
import { PageWrapper } from "@/components/ui/3d-card";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  images?: string[];
}

interface ToolCallResult {
  name: string;
  data: string;
  args?: any;
}

const suggestedActions = [
  { icon: Bird, label: "إضافة قطيع جديد", prompt: "أضف قطيع جديد اسمه القطيع أ-43، سلالة Cobb 500، 8000 طير، عمر 30 يوم" },
  { icon: Egg, label: "تسجيل بيض", prompt: "سجل إنتاج بيض للقطيع flk-001 كمية 5000 بيضة" },
  { icon: HeartPulse, label: "حدث صحي", prompt: "سجل حدث صحي: تطعيم للقطيع flk-001، وصف تطعيم روتيني" },
  { icon: ShoppingCart, label: "أمر بيع", prompt: "أنشئ طلبية لزبون اسمه محمد، المبلغ 2500 درهم" },
  { icon: Receipt, label: "مصروف", prompt: "سجل مصروف 500 درهم، فئة أعلاف، بتاريخ اليوم" },
  { icon: Package, label: "مخزون", prompt: "أضف عنصر مخزون: علف نوع feed، اسم ذرة، 1000 كغ، 3.5 درهم/كغ، حد أدنى 200" },
];

export default function AIVetPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "مرحباً! أنا مساعد POULTRIX الذكي. أستطيع إضافة البيانات وتعديلها وعرضها. جرب إحدى الإجراءات أدناه:" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [recording, setRecording] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }); }, [messages, streaming]);

  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = (overrideText || input).trim();
    if ((!text && images.length === 0) || loading) return;
    setShowSuggestions(false);

    const userMsg: ChatMessage = { role: "user", content: text, images: images.length > 0 ? [...images] : undefined };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); setImages([]); setLoading(true); setStreaming("");

    const payloadMsgs = messages.map(m => {
      if (m.role === "user" && m.images && m.images.length > 0) {
        const parts: any[] = [{ type: "text", text: m.content }];
        for (const base64 of m.images) {
          parts.push({ type: "image", base64: base64.split(",")[1] || base64, mime: "image/jpeg" });
        }
        return { role: "user", content: parts };
      }
      if (m.role === "assistant") {
        return { role: "assistant", content: m.content };
      }
      return { role: "user", content: [{ type: "text", text: m.content }] };
    });

    const payload: any = { messages: [...payloadMsgs, { role: "user", content: [{ type: "text", text }] }] };

    if (images.length > 0) {
      const lastMsg = payload.messages[payload.messages.length - 1];
      for (const base64 of images) {
        lastMsg.content.push({ type: "image", base64: base64.split(",")[1] || base64, mime: "image/jpeg" });
      }
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("API error");
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      let fullContent = "";
      let toolResult: ToolCallResult | null = null;
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.toolResult) {
              toolResult = parsed;
            } else if (parsed.content) {
              fullContent += parsed.content;
              setStreaming(fullContent);
            }
          } catch {}
        }
      }

      if (toolResult) {
        const isSuccess = toolResult.data && !toolResult.data.includes("error");
        const successEmojis: Record<string, string> = {
          add_flock: "✅", record_eggs: "🥚", add_health_event: "💉", add_inventory_item: "📦",
          add_expense: "💰", record_stocking: "📊", add_product: "🏷️", create_order: "🛒"
        };
        const emoji = successEmojis[toolResult.name] || "✅";
        let summary = `${emoji} تم بنجاح!`;
        try {
          const d = JSON.parse(toolResult.data);
          if (d?.id) summary += ` (المعرف: ${d.id})`;
        } catch {}
        const resultText = isSuccess ? summary : `❌ فشل: ${toolResult.data}`;
        setMessages(prev => [...prev, { role: "assistant", content: fullContent || resultText }]);
      } else if (fullContent) {
        setMessages(prev => [...prev, { role: "assistant", content: fullContent }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ عذراً، حدث خطأ في الاتصال" }]);
    }
    setLoading(false); setStreaming("");
  }, [input, images, messages, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImages(prev => [...prev, base64]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorder.current = recorder;
      audioChunks.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setLoading(true);
          fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                ...messages.map(m => {
                  if (m.role === "user" && m.images && m.images.length > 0) {
                    const parts: any[] = [{ type: "text", text: m.content }];
                    for (const base64 of m.images) {
                      parts.push({ type: "image", base64: base64.split(",")[1] || base64, mime: "image/jpeg" });
                    }
                    return { role: "user", content: parts };
                  }
                  if (m.role === "assistant") {
                    return { role: "assistant", content: m.content };
                  }
                  return { role: "user", content: [{ type: "text", text: m.content }] };
                }),
                { role: "user", content: [{ type: "audio", base64: base64.split(",")[1] || base64, mime: "audio/webm" }] }
              ]
            }),
          }).then(async res => {
            const reader = res.body?.getReader();
            if (!reader) return;
            let full = "";
            const decoder = new TextDecoder();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const lines = decoder.decode(value, { stream: true }).split("\n").filter(l => l.startsWith("data: "));
              for (const line of lines) {
                try {
                  const d = JSON.parse(line.slice(6));
                  if (d.content) full += d.content;
                } catch {}
              }
            }
            if (full) setMessages(prev => [...prev, { role: "user", content: "🎤 [رسالة صوتية]" }, { role: "assistant", content: full }]);
            setLoading(false);
          }).catch(() => { setLoading(false); });
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      setRecording(true);
    } catch { setRecording(false); }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <PageWrapper>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          background: "#fff", borderRadius: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)",
          display: "flex", flexDirection: "column", height: "calc(100vh - 160px)", minHeight: "500px", overflow: "hidden",
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f2", display: "flex", alignItems: "center", gap: "10px" }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#34c759" }} />
            <Bot size={20} style={{ color: COLORS.blue }} />
            <span className="font-heading" style={{ fontWeight: "700", fontSize: "1rem", color: "#1a1a24" }}>POULTRIX AI</span>
            <span style={{ fontSize: "0.7rem", color: "#a0a0aa", background: "#f5f5f7", padding: "2px 8px", borderRadius: "4px" }}>يدعم الصور والصوت</span>
          </div>

          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  style={{ display: "flex", gap: "10px", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}
                >
                  <div style={{ width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    background: msg.role === "user" ? COLORS.aqua + "20" : COLORS.blue + "15" }}>
                    {msg.role === "user" ? <User size={16} style={{ color: COLORS.aqua }} /> : <Bot size={16} style={{ color: COLORS.blue }} />}
                  </div>
                  <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: "14px", fontSize: "0.85rem", lineHeight: 1.6,
                    background: msg.role === "user" ? COLORS.aqua + "12" : "#f5f5f7", color: "#1a1a24", border: msg.role === "assistant" ? "1px solid #eeeef0" : "none" }}>
                    {msg.images?.map((img, j) => (
                      <img key={j} src={img} alt="" style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: "8px", marginBottom: "8px", display: "block" }} />
                    ))}
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {streaming && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.blue + "15" }}>
                  <Bot size={16} style={{ color: COLORS.blue }} />
                </div>
                <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: "14px", fontSize: "0.85rem", lineHeight: 1.6, background: "#f5f5f7", border: "1px solid #eeeef0" }}>
                  {streaming}
                  <motion.span animate={{ opacity: [0, 1] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ display: "inline-block", width: "6px", height: "14px", background: COLORS.aqua, marginLeft: "2px", borderRadius: "1px" }} />
                </div>
              </motion.div>
            )}

            {loading && !streaming && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px 16px", borderRadius: "14px", background: "#f5f5f7", width: "fit-content", border: "1px solid #eeeef0" }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #e0e0e0", borderTopColor: COLORS.aqua }} />
                <span style={{ fontSize: "0.8rem", color: "#a0a0aa" }}>POULTRIX AI يفكر...</span>
              </motion.div>
            )}

            {showSuggestions && messages.length <= 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <p style={{ fontSize: "0.75rem", color: "#a0a0aa", marginBottom: "8px" }}>إجراءات سريعة:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {suggestedActions.map((action, i) => (
                    <motion.button key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.05 }}
                      onClick={() => sendMessage(action.prompt)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", border: "1px solid #eeeef0", fontSize: "0.75rem", cursor: "pointer", color: "#5a5a6a", background: "#fff" }}>
                      <action.icon size={14} style={{ color: COLORS.aqua }} />
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {images.length > 0 && (
            <div style={{ padding: "8px 16px 0", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: "relative", width: "60px", height: "60px" }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                  <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    style={{ position: "absolute", top: "-4px", right: "-4px", width: "18px", height: "18px", borderRadius: "50%", border: "none", background: "#ff4444", color: "#fff", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: "12px 16px", borderTop: "1px solid #f0f0f2", display: "flex", gap: "8px", alignItems: "center" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileRef.current?.click()}
              style={{ width: "38px", height: "38px", borderRadius: "10px", border: "1px solid #eeeef0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Image size={18} style={{ color: "#a0a0aa" }} />
            </motion.button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ display: "none" }} />

            <div style={{ flex: 1, position: "relative" }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={recording ? "جاري التسجيل..." : "اكتب رسالة..."}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #eeeef0", fontSize: "0.85rem", outline: "none", boxSizing: "border-box", background: recording ? COLORS.gold + "08" : "#fff" }} />
            </div>

            {recording ? (
              <motion.button animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity }} onClick={stopRecording}
                style={{ width: "38px", height: "38px", borderRadius: "10px", border: "none", background: "#ff4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Square size={16} style={{ color: "#fff" }} />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startRecording}
                style={{ width: "38px", height: "38px", borderRadius: "10px", border: "1px solid #eeeef0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Mic size={18} style={{ color: "#a0a0aa" }} />
              </motion.button>
            )}

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => sendMessage()}
              disabled={loading || (!input.trim() && images.length === 0)}
              style={{ width: "38px", height: "38px", borderRadius: "10px", border: "none", background: loading || (!input.trim() && images.length === 0) ? "#e9eaec" : COLORS.blue, cursor: loading || (!input.trim() && images.length === 0) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Send size={16} style={{ color: loading || (!input.trim() && images.length === 0) ? "#bdc1c5" : "#fff" }} />
            </motion.button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
