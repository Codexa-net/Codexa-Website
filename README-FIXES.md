# Codexa — Fullstack (Frontend + Backend)

المستودع الرئيسي لمنصة وكالة Codexa البرمجية، يضم المشروعين بعد الفحص والتهيئة المعمارية الكاملة:

codexa-fullstack/
├── frontend/    → Next.js 16 (الموقع العام + لوحة التحكم الداشبورد)
└── backend/     → NestJS + Prisma + PostgreSQL (API)


---

## خطوات التشغيل المحلي (Local Setup)

### 1) الباك إند (Backend)
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
يعمل افتراضياً على: http://localhost:3001 (بناءً على APP_PORT في ملف البيئة).

توثيق الـ API متاح عبر Swagger على: http://localhost:3001/api/docs.

تنبيه أمني: تأكد من عدم رفع ملف .env، وقم بتعيين DATABASE_URL وJWT_SECRET الخاصة بك.

2) الفرونت إند (Frontend)
Bash
cd frontend
npm install
npm run dev
يعمل على: http://localhost:3000.

الموقع العام: http://localhost:3000/ar أو /en

تسجيل الدخول: http://localhost:3000/login

لوحة التحكم (بعد تسجيل الدخول): http://localhost:3000/dashboard

لإنشاء بيانات الأدمن الافتراضية لأول مرة في قاعدة البيانات:

Bash
cd backend
npm run prisma:seed
البنية الحالية وما تم إنجازه
الباك إند (NestJS)
إصلاح تعارض المنافذ: تعديل main.ts ليقرأ APP_PORT بدلاً من PORT لمنع التصادم مع الفرونت إند على بورت 3000.

اجتياز اختبارات الـ Unit Tests بالكامل (34/34) ونجاح الـ Build المكتبي.

استقرار مسارات الـ Auth (/auth/login, /auth/me) ونظام الرسائل (POST /contact, /admin/messages).

الفرونت إند (Next.js)
تثبيت وتكامل الحزم الأساسية: next-themes, react-hook-form, zod, @hookform/resolvers.

توافق Next.js 16: ضبط استدعاءات cookies() وجميع دوال الـ Server Components لاستخدام await.

استعادة مكونات الداشبورد الأساسية (Sidebar.tsx, TopNav.tsx) وربطها بالـ Layout العام.

ربط شاشات "طلبات التواصل" ونموذج "تواصل معنا" وتسجيل الخروج بالـ API الحقيقي في الباك إند وقاعدة بيانات Supabase.

دعم كامل للغتين (العربية والانجليزية) وتفعيل الوضعين الليلي والنهاري (Dark/Light Mode).

الوضع الحالي للبيانات والمهام القادمة (Roadmap)
حالة البيانات الحالية:
الباك إند متصل حالياً بقاعدة البيانات لخدمات (المصادقة Auth + طلبات التواصل Contact Messages).
شاشات المشاريع، العملاء، والخدمات تعمل حالياً في الواجهة على بيانات داخلية (Mock Data) لحين اكتمال الـ Models الخاصة بها.

المهام المطلوبة من فريق التطوير:
تيم الـ Backend:

بناء وتحديث schema.prisma لإضافة جداول: PortfolioProject, ClientProject, Milestone, و TeamMember.

إنشاء الـ CRUD Endpoints لكل موديول ورفع توثيق Swagger محدث.

تجهيز خدمة رفع الصور والملفات (Uploads) وتفعيل محرك إرسال الإشعارات البريدية للعميل.

تيم الـ Frontend:

ربط كروت وفلاتر صفحة "أعمالنا" بالـ API الحقيقي الجديد.

بناء فورم إضافة مشاريع البورتفوليو في الداشبورد.

تطوير شاشة بوابة العميل (Client Portal) لمتابعة سير المراحل.
