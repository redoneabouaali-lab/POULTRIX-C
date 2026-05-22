"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Cpu, Sparkles, ImagePlus, Mic, MicOff, XCircle } from "lucide-react";
import { COLORS } from "@/constants";
import { poultrixLibrary } from "@/agents/support-agent/library";
import { Renderer } from "@openuidev/react-lang";

function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => setAudioBase64((reader.result as string).split(",")[1]);
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start(); mediaRef.current = recorder; setRecording(true);
    } catch { alert("الميكروفون غير متاح"); }
  }, []);
  const stop = useCallback(() => { if (mediaRef.current && mediaRef.current.state !== "inactive") { mediaRef.current.stop(); setRecording(false); } }, []);
  return { recording, audioBase64, start, stop, clear: () => setAudioBase64(null) };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => { const reader = new FileReader(); reader.onloadend = () => resolve((reader.result as string).split(",")[1]); reader.readAsDataURL(file); });
}

export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "مرحباً! أنا مساعد POULTRIX AI. كيقدر تسألني أي سؤال على ضيعتك." },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [pendingImages, setPendingImages] = useState<any[]>([]);
  const [uiCode, setUiCode] = useState("");
  const [streamContent, setStreamContent] = useState("");
  const accumulatedRef = useRef("");
  const chatEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { recording, audioBase64, start, stop, clear: clearAudio } = useAudioRecorder();

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamContent]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if ((!text && pendingImages.length === 0 && !audioBase64) || streaming) return;
    const parts: any[] = [];
    pendingImages.forEach((img) => parts.push(img));
    if (audioBase64) { parts.push({ type: "audio", base64: audioBase64, mime: "audio/webm" }); clearAudio(); }
    if (text) parts.push({ type: "text", text });
    const content = parts.length === 1 && parts[0].type === "text" ? parts[0].text : parts;

    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput(""); setPendingImages([]); setStreaming(true); setStreamContent(""); setUiCode("");
    accumulatedRef.current = "";

    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [...messages, { role: "user", content }] }) });
      const reader = res.body?.getReader(); if (!reader) return;
      const decoder = new TextDecoder(); let buffer = "";
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n"); buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try { const parsed = JSON.parse(data); if (parsed.content) { accumulatedRef.current += parsed.content; setStreamContent(accumulatedRef.current); if (parsed.content.includes("root =")) setUiCode((prev) => prev + parsed.content); } } catch {}
        }
      }
      if (accumulatedRef.current) setMessages((prev) => [...prev, { role: "assistant", content: accumulatedRef.current }]);
    } catch { setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ حدث خطأ" }]); }
    setStreaming(false); setStreamContent("");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const type = file.type.startsWith("image") ? "image" : file.type.startsWith("audio") ? "audio" : "video";
    const base64 = await fileToBase64(file);
    setPendingImages((prev) => [...prev, { type, base64, mime: file.type }]);
    e.target.value = "";
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="فتح المحادثة" className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})` }}>
          <MessageCircle size={24} className="text-black" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center"><Sparkles size={10} style={{ color: COLORS.aqua }} /></span>
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 left-6 z-50 w-[380px] max-w-[calc(100vw-24px)] h-[560px] max-h-[calc(100vh-120px)] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{ background: "rgba(10,10,15,0.96)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${COLORS.aqua}15` }}><Cpu size={14} style={{ color: COLORS.aqua }} /></div>
              <div><p className="text-sm font-bold text-white">POULTRIX AI</p><p className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>يدعم الصور والصوت</p></div>
            </div>
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5"><X size={15} style={{ color: "rgba(255,255,255,0.3)" }} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "text-black" : "text-white/80"}`}
                  style={{ background: msg.role === "user" ? `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})` : "rgba(255,255,255,0.06)" }}>
                  {typeof msg.content === "string" ? <p>{msg.content}</p> : <p>[محتوى متعدد]</p>}
                </div>
              </div>
            ))}
            {streaming && streamContent && (
              <div className="flex justify-start">
                <div className="max-w-[88%] rounded-xl px-4 py-2.5 text-sm text-white/80" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p>{streamContent}</p>
                  {uiCode && <div className="mt-2"><Renderer library={poultrixLibrary} response={uiCode as any} /></div>}
                  <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: COLORS.aqua }} />
                </div>
              </div>
            )}
            {streaming && !streamContent && (
              <div className="flex justify-start">
                <div className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: COLORS.aqua }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: COLORS.blue, animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: COLORS.gold, animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>
          {pendingImages.length > 0 && (
            <div className="flex gap-2 px-4 pb-1">
              {pendingImages.map((img, i) => (
                <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <img src={`data:${img.mime};base64,${img.base64}`} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setPendingImages((prev) => prev.filter((_, j) => j !== i))} className="absolute top-0 right-0 w-4 h-4 bg-black/70 rounded-bl-lg flex items-center justify-center"><XCircle size={10} style={{ color: "rgba(255,255,255,0.7)" }} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2 rounded-xl px-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => fileRef.current?.click()} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5" style={{ color: "rgba(255,255,255,0.3)" }}><ImagePlus size={15} /></button>
              <input ref={fileRef} type="file" accept="image/*,audio/*,video/*" className="hidden" onChange={handleFile} />
              <button onClick={recording ? stop : start} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5" style={{ color: recording ? COLORS.gold : "rgba(255,255,255,0.3)" }}>{recording ? <MicOff size={15} /> : <Mic size={15} />}</button>
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={recording ? "جاري التسجيل..." : "اكتب سؤالك هنا..."} className="flex-1 bg-transparent py-2.5 text-sm text-white/80 placeholder-white/20 outline-none" dir="auto" disabled={recording} />
              <button onClick={sendMessage} disabled={streaming || (!input.trim() && pendingImages.length === 0 && !audioBase64)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-20 hover:bg-white/5" style={{ color: COLORS.aqua }}><Send size={15} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
