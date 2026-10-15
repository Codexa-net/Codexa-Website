"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ArrowUpRight 
} from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

// أيقونة لوجو Codexa الرسمية المتطابقة 100% هندسياً
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

// منسق نصوص متوافق مع اللغتين والوضعين
function FormattedText({ content, isArabic }: { content: string; isArabic: boolean }) {
  const lines = content.split("\n");

  return (
    <div 
      className={`space-y-2 leading-relaxed ${isArabic ? "text-right" : "text-left"}`} 
      dir={isArabic ? "rtl" : "ltr"}
    >
      {lines.map((line, lIdx) => {
        let trimmed = line.trim();
        if (!trimmed) return <div key={lIdx} className="h-1" />;

        if (trimmed === "---" || trimmed === "***") {
          return <hr key={lIdx} className="my-2 border-slate-200 dark:border-white/10" />;
        }

        const isHeader = trimmed.startsWith("#");
        if (isHeader) {
          trimmed = trimmed.replace(/^#+\s*/, "");
          return (
            <h4 key={lIdx} className="mt-2 text-[13px] font-bold text-[#5142df] dark:text-[#a799ff]">
              {trimmed}
            </h4>
          );
        }

        const parts = trimmed.split(/(\*\*.*?\*\*)/g);

        return (
          <p key={lIdx} className="text-[12.5px] text-slate-700 dark:text-slate-200">
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
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

export function ClassicChatbot({ lang = "ar" }: { lang?: string }) {
  const isArabic = lang === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
  }, [messages, loading]);

  const suggestions = isArabic
    ? ["ما هي خدماتكم؟", "كيف تبدأون تنفيذ المشاريع؟", "أريد متابعة مشروعي"]
    : ["What services do you offer?", "How do you start projects?", "Track my project"];

  const handleSend = async (customText?: string) => {
    const query = customText || input;
    if (!query.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    if (!customText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          lang,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: isArabic
            ? "يسعدنا دائماً خدمتك في **Codexa**! يمكنك التواصل المباشر مع **المهندس عمر القاضي** عبر واتساب: **01277158762**"
            : "We're always glad to assist you at **Codexa**! You can reach **Eng. Omar El Kady** on WhatsApp: **+201277158762**",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed bottom-6 z-50 flex flex-col font-sans"
      style={{ [isArabic ? "left" : "right"]: "1.5rem" }}
    >
      {/* نافذة المحادثة (تظهر مباشرة عند الفتح بدون تكرار أزرار) */}
      {isOpen ? (
        <div className="flex h-[525px] w-[340px] flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-all duration-300 dark:border-white/15 dark:bg-[#0b091a]/95 dark:text-white dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] sm:w-[380px]">
          
          {/* الترويسة العلوية وبها زر الإغلاق (X) الوحيد والواضح */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4 py-3.5 transition-colors dark:border-white/10 dark:bg-[#120f26]/90">
            <div className="flex items-center gap-3">
              
              {/* لوجو Codexa الرسمي */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-white/15 dark:bg-[#16132d]">
                <CodexaLogoIcon />
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#120f26]"></span>
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

            {/* زر الإغلاق المعتمد في أعلى الترويسة */}
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1.5 text-slate-400 transition-all hover:bg-slate-200/60 hover:text-slate-800 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
              title={isArabic ? "إغلاق الشات" : "Close Chat"}
            >
              <X size={18} />
            </button>
          </div>

          {/* مساحة عرض الرسائل */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4 text-xs scrollbar-thin">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm transition-colors ${
                    m.sender === "user"
                      ? "rounded-tr-xs bg-[#5142df] text-white shadow-[#5142df]/25"
                      : "rounded-tl-xs border border-slate-200/80 bg-slate-100 text-slate-800 dark:border-white/10 dark:bg-[#16132d] dark:text-gray-100"
                  }`}
                >
                  <FormattedText content={m.text} isArabic={isArabic} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 py-1 text-[11px] text-slate-400 dark:text-gray-400">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5142df]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5142df] [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5142df] [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* أزرار الاقتراحات السريعة */}
          <div className="flex gap-1.5 overflow-x-auto border-t border-slate-200/70 bg-slate-50/70 px-3 py-2 no-scrollbar dark:border-white/5 dark:bg-[#0e0c1f]">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-medium text-slate-700 transition-all hover:border-[#5142df] hover:text-[#5142df] dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-[#5142df] dark:hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>

          {/* شريط الإدخال ومحادثة واتساب */}
          <div className="border-t border-slate-200/80 bg-slate-50/90 p-3 transition-colors dark:border-white/10 dark:bg-[#120f26]/95">
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
                placeholder={isArabic ? "اكتب استفسارك هنا..." : "Type your query..."}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#5142df] focus:outline-none dark:border-white/10 dark:bg-[#181533] dark:text-white dark:placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5142df] to-[#6e56cf] text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
              >
                <Send size={14} className={isArabic ? "rotate-180" : ""} />
              </button>
            </form>

            <div className="mt-2.5 flex items-center justify-between px-1 text-[10px] text-slate-500 dark:text-gray-400">
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
        /* الزر العائم الخارجي (يظهر فقط حينما يكون الشات مغلقاً) */
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-[#5142df] to-[#7928ca] text-white shadow-[0_0_25px_rgba(81,66,223,0.5)] transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Open Chat"
        >
          <MessageSquare size={22} className="transition-transform group-hover:scale-110" />
          <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#0b091a]" />
        </button>
      )}
    </div>
  );
}