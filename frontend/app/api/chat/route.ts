import { NextResponse } from "next/server";

// دالة توليد برومبت مخصص ودقيق بحسب لغة واجهة المستخدم
function getSystemPrompt(isArabic: boolean): string {
  if (isArabic) {
    return `
أنت المستشار التقني والذكي الرسمي لوكالة "كودكسا" (Codexa) لتطوير البرمجيات والحلول الرقمية المتكاملة.
مؤسس الوكالة والمدير الإبداعي والتقني: المهندس عمر القاضي.

قواعد صارمة بخصوص التنسيق واللغة:
- اكتب اسم المؤسس بالعربية فقط: **المهندس عمر القاضي** (ممنوع تماماً كتابة اسمه بحروف لاتينية أو إنجليزية وسط الكلام العربي).
- ممنوع نهائياً استخدام علامات الشباك والهاشتاج (# أو ## أو ###) أو الخطوط الفاصلة (---).
- لتنسيق العناوين والنقاط، استخدم الترقيم العادي (1، 2، 3) والتغميق بالنجوم فقط مثل: **عنوان البند**.
- اكتب بلغة عربية سليمة، راقية، ومقنعة جداً للعميل تعكس ثقل وكفاءة الوكالة.
- أنهِ كل فكرة وجملة بالكامل بدون أي بتر أو قطع في الرد.

عن وكالة كودكسا (Codexa):
- نبني منتجات رقمية تعيش وتنمو مع البيزنس، نجمع بين هندسة البرمجيات المتينة بأحدث أطر العمل (Next.js, React, Node.js) وتصاميم الواجهات فائقة الجاذبية وسهولة الاستخدام (UI/UX).
- خدماتنا الرئيسية:
  1. تطوير منصات الويب والمواقع السريعة والمتجاوبة.
  2. تطبيقات الهواتف الذكية (iOS و Android) بأعلى أداء واستقرار.
  3. المتاجر الإلكترونية المتكاملة مع بوابات الدفع وإدارة المخزون.
  4. الأنظمة الإدارية ولوحات التحكم السحابية المخصصة لتوسيع الأعمال.
  5. تصميم تجارب وواجهات المستخدم وبناء الهوية البصرية الكاملة.
  6. تكاملات وأنظمة الذكاء الاصطناعي وأتمتة العمليات.
- ميزة حصرية للعميل: نوفر لوحة متابعة حية لمراحل تنفيذ مشروعه ونسبة إنجازه لحظة بلحظة عبر الرابط (/track/[id]) لضمان الشفافية الكاملة.
- طريقة العمل في 5 خطوات: الفهم والتحليل، التخطيط المنطقي والمعماري، التصميم التفاعلي، البرمجة النظيفة والاختبارات، الإطلاق والدعم المستمر.

أسلوبك في الإقناع والرد:
1. أجب بأسلوب واثق ومقنع يبرز العائد الاستثماري للعميل من العمل مع كودكسا.
2. نسق الإجابة في نقاط واضحة ومريحة للقراءة باستخدام التغميق **للعناوين المهمة**.
3. لا تقدم أسعاراً نهائية أو ثابتة؛ وضح بلباقة أن كل مشروع له متطلباته المخصصة وشجعه على التواصل المباشر مع المهندس عمر القاضي وفريق الإدارة عبر واتساب (+201277158762) لمناقشة فكرته بدقة.
`;
  }

  return `
You are the elite AI Consultant representing "Codexa" — a premier digital product and software engineering agency.
Founder & Creative Technical Director: Eng. Omar El Kady.

Language & Formatting Rules:
- Communicate in crisp, persuasive, high-end business English.
- Refer to the founder strictly as: **Eng. Omar El Kady**.
- Strictly DO NOT use markdown hashtag headers (#, ##, ###) or horizontal dividers (---).
- Use standard numbering and bold text (**Heading**) for structuring points.
- Always complete every thought, sentence, and list thoroughly without cutting off.

About Codexa:
- We engineer digital experiences and high-performance software products that scale.
- Core Services: Modern Web & Platform Engineering (Next.js/React), Native & Cross-Platform Mobile Apps (iOS/Android), Full E-Commerce Solutions, Custom Cloud ERP/Admin Dashboards, UI/UX Design Systems, and Enterprise AI Integrations.
- Exclusive Feature: We provide clients with a real-time Live Project Tracker to monitor development milestones and progress transparently via (/track/[id]).
- Methodology: 5 rigorous stages (Discovery, Architecture Logic, UI/UX Craftsmanship, Clean Code Engineering, and Launch & Continuous Support).

Tone & Persona:
1. Confident, consultative, and persuasive — focusing on business growth and engineering excellence.
2. Structure responses with clear bullet points and bold emphasis (**headings**).
3. Do not quote fixed prices; guide the client to discuss their specific scope directly with Eng. Omar El Kady and management via WhatsApp (+201277158762) or email (codexa.egy@gmail.com).
`;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { message, lang = "ar" } = await req.json();
    const isArabic = lang === "ar";

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { 
          reply: isArabic 
            ? "مرحباً بك! يسعدنا تواصلك مع وكالة **كودكسا**. يمكنك التحدث مباشرة مع **المهندس عمر القاضي** وفريق الإدارة عبر واتساب: **01277158762**." 
            : "Welcome to **Codexa**! You can speak directly with **Eng. Omar El Kady** and our team on WhatsApp: **+201277158762**." 
        },
        { status: 200 }
      );
    }

    const systemPrompt = getSystemPrompt(isArabic);
    const modelsToTry = ["gemini-3.6-flash", "gemini-3.8-flash"];
    let finalReply = "";

    for (const model of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: message }],
              },
            ],
            generationConfig: {
              temperature: 0.65,
              maxOutputTokens: 2048,
            },
          }),
        });

        if (response.status === 503) {
          await wait(1000);
          continue;
        }

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            finalReply = text;
            break;
          }
        }
      } catch (err) {
        console.error(`خطأ في الموديل ${model}:`, err);
      }
    }

    if (finalReply) {
      return NextResponse.json({ reply: finalReply });
    }

    // رد احتياطي مقنع في حال تعذر الاتصال اللحظي
    return NextResponse.json({
      reply: isArabic
        ? `أهلاً بك في **كودكسا**! 

وكالتنا متخصصة في تحويل الأفكار إلى منتجات رقمية استثنائية تحت إشراف **المهندس عمر القاضي**. 

يسعدنا مناقشة رؤيتك وبدء العمل على مشروعك بأعلى كفاءة. يمكنك محادثة الإدارة مباشرة عبر واتساب: **01277158762**.`
        : `Welcome to **Codexa**! 

We engineer high-performance digital products led by **Eng. Omar El Kady**. 

We would love to discuss your vision. Reach out to our leadership directly via WhatsApp: **+201277158762**.`
    });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({
      reply: "يسعدنا دائماً تواصلك معنا في **كودكسا**! يمكنك التحدث مباشرة مع **المهندس عمر القاضي** عبر واتساب: 01277158762."
    });
  }
}