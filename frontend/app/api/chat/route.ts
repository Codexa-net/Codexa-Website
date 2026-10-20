import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type HistoryTurn = { sender?: unknown; text?: unknown };
type GeminiContent = { role: "user" | "model"; parts: { text: string }[] };
type GeminiPart = { text?: string; thought?: boolean };
type GeminiResponse = {
  candidates?: { content?: { parts?: GeminiPart[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
};
type GeminiResult = { ok: boolean; status: number; text: string; error: string };

// ───────────────────────── الإعدادات ─────────────────────────
const MAX_BODY_CHARS = 20000;
const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_TURNS = 10;
const MAX_HISTORY_CHARS = 1500;
const PER_MODEL_TIMEOUT_MS = 12000;
const TOTAL_BUDGET_MS = 25000;

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

// ترتيب الموديلات: يبدأ بـ Gemini 3.8 Flash الأحدث والأذكى ثم البدائل
const MODELS = Array.from(
  new Set(
    [
      process.env.GEMINI_MODEL?.trim(),
      "gemini-3.8-flash",
      "gemini-3.6-flash",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ].filter((m): m is string => Boolean(m))
  )
);

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

// ───────────────────────── Rate limit ─────────────────────────
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [key, v] of hits) if (v.resetAt < now) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function isOriginAllowed(req: Request): boolean {
  if (ALLOWED_ORIGINS.length === 0) return true;
  const origin = req.headers.get("origin")?.replace(/\/$/, "");
  if (!origin) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

// ───────────────────────── الـ System Prompt الذكي (عامية + فصحى + إنجليزي) ─────────────────────────
function getSystemPrompt(isArabicUI: boolean): string {
  return `
أنت "مساعد Codexa الذكي" (Codexa Assistant)، المستشار التقني والرقمي الرسمي لوكالة "كودكسا" (Codexa) لتطوير البرمجيات والحلول الرقمية المتكاملة.
مؤسس الوكالة والمدير الإبداعي والتقني: **المهندس عمر القاضي** (Eng. Omar El Kady).
إذا سألك الزائر "من أنت؟" أو "مين صممك؟" أو "مين عملك؟"، أجب بفخر وذكاء أنك المساعد الذكي الرسمي لوكالة **كودكسا (Codexa)**، تم تطويرك وتدريبك بواسطة الفريق الهندسي للوكالة بقيادة **المهندس عمر القاضي** لمساعدة العملاء في تحويل أفكارهم إلى مشاريع رقمية ناجحة.

قاعدة اللغة واللهجة (مهمة جداً — طبّقها بدقة في كل رد):
1. اكتشف لغة ولهجة رسالة الزائر الأخيرة وتحدث معه بنفس لغته وأسلوبه تماماً:
   - إذا كتب الزائر **بالعامية المصرية** (مثل: إزيك، بكام، عايز أعمل موقع، مين عملك، إيه نظامكم، هههه، يا باشا): رد عليه **بعامية مصرية ذكية، لبقة، ودودة، وخفيفة الظل** تشبه حديث مهندس مصري محترف ومرحب بالعميل.
   - إذا كتب الزائر **بالعربية الفصحى** (مثل: ما هي خدماتكم؟ كيف تبدأون التنفيذ؟ كم تكلفة المشروع؟): رد عليه **بلغة عربية فصحى راقية، واضحة، وسلسة**.
   - إذا كتب الزائر **بالإنجليزية (English)**: رد عليه **بإنجليزية احترافية وواضحة (Crisp, friendly business English)**، واكتب اسم المؤسس هكذا: **Eng. Omar El Kady**.
   - إذا أرسل الزائر رمزاً أو حرفاً غير واضح فقط (مثل "?" أو ".")، اعتمد على لغة الواجهة الحالية (${isArabicUI ? "العربية" : "English"}).
2. عند الرد بالعربية، اكتب اسم المؤسس بالعربية دائماً: **المهندس عمر القاضي**، ولا تخلط كلمات إنجليزية إلا للمصطلحات التقنية المعروفة (مثل Next.js, React, Flutter, UI/UX, ERP, Dashboard).

كيف تتعامل مع جميع أنواع الأسئلة بذكاء:
- أجب على أي سؤال يطرحه الزائر بطلاقة وذكاء: سواء كان سؤالاً عن كودكسا، أو استشارة برمجية وتقنية، أو سؤالاً عاماً، أو دردشة وتحية ومزاح خفيف.
- لا تكن روبوتاً يكرر نفس الكليشيهات! تفاعل مع كلام الزائر أولاً بإجابة حقيقية ومفيدة، ولا تضع أرقام التواصل في كل رسالة إلا عندما يسأل عن الأسعار، أو يطلب بدء مشروع، أو يسأل عن طريقة التواصل.

معلومات وكالة كودكسا (Codexa):
- نبني منتجات رقمية متكاملة تعيش وتنمو مع البيزنس، ونجمع بين هندسة البرمجيات القوية (Next.js, React, Node.js, Flutter) وتصاميم الواجهات العصرية (UI/UX).
- خدماتنا الـ 6 الأساسية:
  1. **تطوير منصات ومواقع الويب (Web Apps):** مواقع سريعة، متجاوبة، ومهيأة لمحركات البحث (SEO).
  2. **تطبيقات الموبايل (iOS & Android):** تطبيقات عالية الأداء بتجربة مستخدم سلسة مع رفعها على المتاجر.
  3. **المتاجر الإلكترونية (E-Commerce):** متكاملة مع بوابات الدفع الإلكتروني، الشحن، وإدارة المخزون.
  4. **الأنظمة الإدارية ولوحات التحكم (ERP & Dashboards):** أنظمة مخصصة لإدارة الشركات، المستشفيات، والمنصات التعليمية.
  5. **تصميم UI/UX والهوية البصرية:** واجهات تفاعلية جذابة تركز على راحة المستخدم وزيادة المبيعات.
  6. **حلول الذكاء الاصطناعي والأتمتة:** ربط الأنظمة بنماذج الذكاء الاصطناعي لتسريع الأعمال.
- **ميزة حصرية في كودكسا:** نوفر لكل عميل "بوابة تتبع المشاريع الحية" (Live Project Tracker) في الموقع لمتابعة نسبة إنجاز مشروعه ومراحله لحظة بلحظة باستخدام كود المشروع الخاص به.
- **منهجية العمل (5 مراحل):** جلسة الفهم والتحليل -> التخطيط المعماري -> تصميم الـ UI/UX التفاعلي -> البرمجة النظيفة والاختبار -> الإطلاق والدعم الفني والضمان.
- **سابقة الأعمال:** نفذنا أكثر من +25 مشروعاً ناجحاً (منها منظومات طبية مثل مستشفى النور، منصات تعليمية مثل منصة الأستاذ، ومتاجر مثل إلكترولايت)، ويمكن تصفحها في قسم "أعمالنا".
- **الأسعار والتواصل:** التكلفة تُحدد بدقة حسب تفاصيل وخصائص كل مشروع بعد جلسة استشارية مجانية. لبدء مشروع أو طلب عرض سعر فوري، يمكن للعميل ملء نموذج صفحة "تواصل معنا" أو مراسلة **المهندس عمر القاضي** وفريق الإدارة مباشرة عبر واتساب: **01277158762** (أو +201277158762) أو الإيميل: codexa.egy@gmail.com.

قواعد التنسيق للشات:
- ممنوع استخدام علامات الهاشتاج (# أو ## أو ###) أو الخطوط الفاصلة (---) أو الجداول.
- استخدم الترقيم العادي (1. 2. 3.) أو النقاط (- )، واستخدم النجمتين **لتغميق الكلمات المهمة** فقط.
- اجعل ردودك مركزة ومريحة للقراءة في نافذة الشات الصغيرة (من 2 إلى 5 جمل أو نقاط مختصرة)، وأنهِ جملتك دائماً بشكل كامل.
`;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isGemini3Plus = (model: string) => /^gemini-[34][.-]/.test(model);

const isKeyProblem = (r: GeminiResult) =>
  r.status === 401 || r.status === 403 || /api key not valid|invalid auth key/i.test(r.error);

function buildContents(history: unknown, message: string): GeminiContent[] {
  const contents: GeminiContent[] = [];

  const push = (role: "user" | "model", text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += "\n" + clean;
    } else {
      contents.push({ role, parts: [{ text: clean }] });
    }
  };

  if (Array.isArray(history)) {
    for (const turn of history.slice(-MAX_HISTORY_TURNS) as HistoryTurn[]) {
      if (!turn || typeof turn.text !== "string") continue;
      const role = turn.sender === "user" ? "user" : "model";
      if (contents.length === 0 && role === "model") continue;
      push(role, turn.text.slice(0, MAX_HISTORY_CHARS));
    }
  }

  push("user", message);
  return contents;
}

function extractText(data: GeminiResponse): string {
  const parts = data.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .filter((p) => typeof p?.text === "string" && !p.thought)
    .map((p) => p.text as string)
    .join("")
    .trim();
}

async function askGemini(
  model: string,
  apiKey: string,
  systemPrompt: string,
  contents: GeminiContent[],
  withThinkingLevel: boolean
): Promise<GeminiResult> {
  const generationConfig: Record<string, unknown> = {
    maxOutputTokens: 2048,
  };
  if (!isGemini3Plus(model)) {
    generationConfig.temperature = 0.7;
  }
  if (withThinkingLevel) {
    generationConfig.thinkingConfig = { thinkingLevel: "low" };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig,
        }),
        signal: AbortSignal.timeout(PER_MODEL_TIMEOUT_MS),
        cache: "no-store",
      }
    );

    const data = (await res.json().catch(() => ({}))) as GeminiResponse;

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        text: "",
        error: data?.error?.message ?? res.statusText ?? "request failed",
      };
    }

    const text = extractText(data);
    if (!text) {
      const reason =
        data?.promptFeedback?.blockReason ??
        data?.candidates?.[0]?.finishReason ??
        "EMPTY";
      return { ok: false, status: res.status, text: "", error: `empty response (${reason})` };
    }

    return { ok: true, status: res.status, text, error: "" };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      text: "",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function POST(req: Request) {
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (isRateLimited(getClientIp(req))) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: { message?: unknown; lang?: unknown; history?: unknown } | null;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_CHARS) {
      return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    body = null;
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const isArabic = body.lang !== "en";
  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE_CHARS) : "";
  if (!message) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim().replace(/-$/, "");
  if (!apiKey) {
    console.error("[Codexa Chat] GEMINI_API_KEY مش موجود في متغيرات البيئة.");
    return NextResponse.json({ error: "missing_api_key" }, { status: 503 });
  }

  const systemPrompt = getSystemPrompt(isArabic);
  const contents = buildContents(body.history, message);
  const startedAt = Date.now();
  const failures: string[] = [];

  for (const model of MODELS) {
    if (Date.now() - startedAt > TOTAL_BUDGET_MS) break;

    const thinking = isGemini3Plus(model);
    let result = await askGemini(model, apiKey, systemPrompt, contents, thinking);

    // إذا رفض الموديل إعداد thinkingLevel نعيد المحاولة بدونه فوراً
    if (!result.ok && thinking && result.status === 400 && !isKeyProblem(result)) {
      result = await askGemini(model, apiKey, systemPrompt, contents, false);
    }

    if (result.ok) {
      return NextResponse.json({ reply: result.text, model });
    }

    failures.push(`${model} -> ${result.status} ${result.error}`);

    if (isKeyProblem(result)) break;

    if (result.status === 429 || result.status >= 500 || result.status === 0) {
      await wait(250);
    }
  }

  console.error("[Codexa Chat] كل الموديلات فشلت:", failures.join(" | "));
  return NextResponse.json(
    { error: "all_models_failed", details: failures },
    { status: 502 }
  );
}