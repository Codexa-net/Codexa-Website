"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

function CodexaLogoIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 66 26 A 33 33 0 1 0 66 74"
        stroke="#5142df"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M 68 42 L 82 58 M 82 42 L 68 58"
        stroke="#5142df"
        strokeWidth="8.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getErrorMessage(isArabic: boolean): string {
  return isArabic
    ? "معلش، حصلت مشكلة مؤقتة ومقدرتش أرد دلوقتي 🙏\nجرّب تبعت رسالتك تاني، أو كلّم الفريق مباشرة على واتساب: **01277158762**"
    : "Sorry, something went wrong on my side 🙏\nPlease try again, or reach the team directly on WhatsApp: **+201277158762**";
}

function FormattedText({ content, isArabic }: { content: string; isArabic: boolean }) {
  const lines = content.split("\n");

  return (
    <div
      className={`space-y-1.5 leading-relaxed ${isArabic ? "text-right" : "text-left"}`}
      dir="auto"
    >
      {lines.map((line, lIdx) => {
        let trimmed = line.trim();
        if (!trimmed) return <div key={lIdx} className="h-0.5" />;

        if (trimmed === "---" || trimmed === "***") {
          return <hr key={lIdx} className="my-1.5 border-slate-200 dark:border-white/10" />;
        }

        if (trimmed.startsWith("#")) {
          trimmed = trimmed.replace(/^#+\s*/, "");
          return (
            <h4
              key={lIdx}
              dir="auto"
              className="mt-1.5 text-[12.5px] font-bold text-[#5142df] dark:text-[#a799ff]"
            >
              {trimmed}
            </h4>
          );
        }

        if (/^[-*]\s+/.test(trimmed) && !trimmed.startsWith("**")) {
          trimmed = "• " + trimmed.replace(/^[-*]\s+/, "");
        }

        const parts = trimmed.split(/(\*\*.*?\*\*)/g);

        return (
          <p key={lIdx} dir="auto" className="text-[12px] text-slate-700 dark:text-slate-200">
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
                return (
                  <strong key={pIdx} className="font-bold text-slate-950 dark:text-white">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
    </div>
  );
}

export function ClassicChatbot({ lang = "ar" }: { lang?: string }) {
  const isArabic = lang === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: isArabic
        ? "مرحباً بك في **Codexa**! أنا مساعدك الذكي، كيف يمكنني مساعدتك في تطوير مشروعك اليوم؟"
        : "Welcome to **Codexa**! I am your AI assistant, how can I help you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: isArabic
          ? "مرحباً بك في **Codexa**! أنا مساعدك الذكي، كيف يمكنني مساعدتك في تطوير مشروعك اليوم؟"
          : "Welcome to **Codexa**! I am your AI assistant, how can I help you today?",
      },
    ]);
  }, [isArabic]);

  const suggestions = isArabic
    ? ["ما هي خدماتكم؟", "كم تكلفة المشروع؟", "كيف تبدأون التنفيذ؟", "أريد متابعة مشروعي"]
    : ["What services do you offer?", "Project pricing?", "How do you start?", "Track my project"];

  const handleSend = async (customText?: string) => {
    const query = (customText ?? input).trim();
    if (!query || isLoading) return;

    const history = messages.map((m) => ({ sender: m.sender, text: m.text }));

    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    if (!customText) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          lang: isArabic ? "ar" : "en",
          history,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || typeof data?.reply !== "string" || !data.reply.trim()) {
        console.warn("[Codexa Chat] API error details:", data);
        setMessages((prev) => [...prev, { sender: "bot", text: getErrorMessage(isArabic) }]);
        return;
      }

      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.warn("[Codexa Chat] network failure:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: getErrorMessage(isArabic) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed bottom-4 z-50 flex flex-col font-sans sm:bottom-6"
      style={{ [isArabic ? "left" : "right"]: "1rem" }}
    >
      {isOpen ? (
        <div className="flex h-[min(480px,calc(100svh-5rem))] w-[calc(100vw-2rem)] max-w-[350px] flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all duration-300 sm:h-[525px] sm:w-[380px] sm:max-w-none dark:border-white/15 dark:bg-[#0b091a]/95 dark:text-white dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-3 py-2.5 transition-colors sm:px-4 sm:py-3.5 dark:border-white/10 dark:bg-[#120f26]/90">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:h-10 sm:w-10 dark:border-white/15 dark:bg-[#16132d]">
                <CodexaLogoIcon />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white sm:h-3 sm:w-3 dark:ring-[#120f26]"></span>
                </span>
              </div>

              <div>
                <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  Codexa Assistant
                  <Sparkles size={13} className="text-[#5142df] dark:text-[#8c7aff]" />
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">
                  {isArabic ? "مساعدك الرقمي الذكي • متصل الآن" : "AI Digital Advisor • Online"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1.5 text-slate-400 transition-all hover:bg-slate-200/60 hover:text-slate-800 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
              title={isArabic ? "إغلاق الشات" : "Close Chat"}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 space-y-3 overflow-y-auto p-3 text-xs scrollbar-thin sm:space-y-3.5 sm:p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm transition-colors sm:max-w-[85%] sm:px-4 sm:py-3 ${
                    m.sender === "user"
                      ? "rounded-tr-xs bg-[#5142df] text-white shadow-[#5142df]/25"
                      : "rounded-tl-xs border border-slate-200/80 bg-slate-100 text-slate-800 dark:border-white/10 dark:bg-[#16132d] dark:text-gray-100"
                  }`}
                >
                  {m.sender === "user" ? (
                    <p
                      dir="auto"
                      className="whitespace-pre-wrap break-words text-[12px] text-white"
                    >
                      {m.text}
                    </p>
                  ) : (
                    <FormattedText content={m.text} isArabic={isArabic} />
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-xs border border-slate-200/80 bg-slate-100 px-4 py-2.5 dark:border-white/10 dark:bg-[#16132d]">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="flex gap-1.5 overflow-x-auto border-t border-slate-200/70 bg-slate-50/70 px-2.5 py-2 no-scrollbar sm:px-3 dark:border-white/5 dark:bg-[#0e0c1f]">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item)}
                disabled={isLoading}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 transition-all hover:border-[#5142df] hover:text-[#5142df] disabled:opacity-50 sm:px-3 sm:py-1.5 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-[#5142df] dark:hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Input & WhatsApp bar */}
          <div className="border-t border-slate-200/80 bg-slate-50/90 p-2 transition-colors sm:p-3 dark:border-white/10 dark:bg-[#120f26]/95">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={1000}
                placeholder={isArabic ? "اكتب استفسارك هنا..." : "Type your query..."}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#5142df] focus:outline-none sm:px-3.5 sm:py-2.5 dark:border-white/10 dark:bg-[#181533] dark:text-white dark:placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5142df] to-[#6e56cf] text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
              >
                <Send size={14} className={isArabic ? "rotate-180" : ""} />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-slate-500 dark:text-gray-400">
              <span>{isArabic ? "تفضل التواصل البشري؟" : "Prefer direct human support?"}</span>
              <a
                href="https://wa.me/201277158762"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-600 transition-colors hover:underline dark:text-emerald-400"
              >
                {isArabic ? "واتساب الإدارة" : "WhatsApp"}
                <ArrowUpRight size={11} />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-[#5142df] to-[#7928ca] text-white shadow-[0_0_25px_rgba(81,66,223,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 sm:h-14 sm:w-14"
          aria-label="Open Chat"
        >
          <MessageSquare size={20} className="transition-transform group-hover:scale-110 sm:size-[22px]" />
          <span className="absolute top-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white sm:top-1 sm:right-1 sm:h-3.5 sm:w-3.5 dark:ring-[#0b091a]" />
        </button>
      )}
    </div>
  );
}