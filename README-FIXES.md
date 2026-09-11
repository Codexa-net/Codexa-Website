# Codexa — Fullstack (Frontend + Backend)

هذا الأرشيف فيه المشروعين بعد الفحص والإصلاح الكامل:

```
codexa-fullstack/
├── frontend/   → Next.js 16 (الموقع العام + لوحة التحكم)
└── backend/    → NestJS + Prisma + PostgreSQL (API)
```

## التشغيل

### 1) الباك إند
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```
هيشتغل على `http://localhost:3001` (حسب `APP_PORT` في `.env`). توثيق الـ API متاح على `http://localhost:3001/api/docs`.

> ملاحظة: ملف `.env` فيه بيانات اتصال حقيقية بقاعدة بيانات Supabase. لو هتشارك المشروع مع حد، غيّر/اعمل rotate لـ `DATABASE_URL` و`JWT_SECRET`.

### 2) الفرونت إند
```bash
cd frontend
npm install
npm run dev
```
هيشتغل على `http://localhost:3000`. لازم الباك إند يكون شغال الأول عشان تسجيل الدخول والرسائل يشتغلوا.

- الموقع العام: `http://localhost:3000/ar` أو `/en`
- تسجيل الدخول: `http://localhost:3000/login`
- لوحة التحكم (بعد تسجيل الدخول): `http://localhost:3000/dashboard`

بيانات الأدمن الافتراضية (من `ADMIN_SEED_*` في `.env` الخاص بالباك إند) — لازم تكون متعملة seed لقاعدة البيانات الأول:
```bash
cd backend
npm run prisma:seed
```

---

## أهم الإصلاحات اللي تمت

### الباك إند
- **باغ حرج**: `main.ts` كان بيقرأ متغير بيئة `PORT` بينما `.env` معرّف `APP_PORT` → كان السيرفر بيشتغل دايمًا على البورت الافتراضي 3000 ويتصادم مع الفرونت إند. تم تصحيحه ليقرأ `APP_PORT`.
- تم التأكد من عمل الـ Build (`nest build`) وكل الـ Unit Tests (34/34) بنجاح.
- تم تشغيله فعليًا والتأكد من ظهور كل الـ Routes بشكل صحيح (`/auth/login`, `/auth/me`, `POST /contact`, `/admin/messages...`).

### الفرونت إند
- إضافة الحزم الناقصة من `package.json` رغم استخدامها الفعلي في الكود: `next-themes`, `react-hook-form`, `zod`, `@hookform/resolvers`.
- إصلاح `lib/api.ts`: كان بينادي `cookies()` بدون `await` (مطلوبة في Next.js 15/16).
- استعادة `components/dashboard/Sidebar.tsx` و`TopNav.tsx` بعد ما كانا محذوفين (بإعادة تصديرهم من نفس المكوّنات الفعلية المستخدمة في `app/dashboard/layout.tsx`، بدون أي تغيير في التصميم).
- التأكد من ربط شاشة "طلبات التواصل" في اللوحة، وفورم "تواصل معنا" في الموقع العام، وزر تسجيل الخروج — كلهم بالـ API الحقيقي (مش بيانات وهمية).
- إصلاح استدعاءات `async` كانت ناقصة `await` في صفحات الموقع العام (`our-work`, `clients`, الصفحة الرئيسية) وده كان يكسر الـ build.
- إصلاح `Button` component ليدعم `size` prop المستخدم فعليًا في `hero-section.tsx`.
- إعادة تسمية `middleware.ts` إلى `proxy.ts` مطابقةً للبنية الموثقة في التصميم المعماري الأصلي للمشروع.
- التأكد من تطابق مفاتيح الترجمة بالكامل بين `messages/ar.json` و`messages/en.json`.
- تفعيل الوضع الليلي/النهاري بالكامل عبر `next-themes` — شغال في اللوحة والموقع العام مع بعض.

### قيد مهم يجب معرفته
الباك إند الحالي **لا يحتوي** على أي Endpoints أو حتى جداول قاعدة بيانات (Prisma models) لـ **المشاريع/العملاء/الخدمات** — فقط `auth`، `contact messages`، و`admin users` (للاستخدام الداخلي في تسجيل الدخول فقط، بدون endpoint لعرضهم). لذلك:
- شاشات المشاريع/العملاء/الخدمات في اللوحة، وصفحتي "أعمالنا" و"عملاؤنا" في الموقع العام، تعمل حاليًا على بيانات احتياطية محلية (fallback) وليست متصلة بقاعدة بيانات حقيقية.
- تسجيل الدخول، وطلبات التواصل (الإرسال من الموقع + عرضها وتعليمها كمقروءة وحذفها من اللوحة) **متصلة بالكامل** بالباك إند الحقيقي وقاعدة بيانات Supabase.

لو حابب أبني موديولز Projects/Clients/Services كاملة في الباك إند (Prisma models + migrations + NestJS CRUD) عشان الموقع يبقى متصل بالكامل 100%، قولي وأبدأ فيها — بس هتحتاج تأكيد صريح مني قبل تنفيذ أي migration على قاعدة بيانات Supabase الحقيقية بتاعتك.
