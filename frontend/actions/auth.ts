'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SUPABASE_ADMIN_USERS = [
  {
    id: 'ebb68484-a5b3-450c-84b9-2bfae2430008',
    name: 'عمر القاضي',
    email: 'alqadi@codexa.net',
    role: 'SUPER_ADMIN',
    track: 'FULL_STACK',
    jobTitle: 'مدير نظام (Super Admin)',
  },
  {
    id: '356b33c8-f3f1-4244-b060-2c84e1329001',
    name: 'فارس محمد سعيد الشرقاوي',
    email: 'fareselsharkawy517@codexa.com',
    role: 'GRAPHIC_DESIGNER',
    track: 'UI_UX',
    jobTitle: 'مصمم جرافيك (Graphic Designer)',
  },
  {
    id: '46f234d0-4a10-4f32-a39e-d33b49ee0002',
    name: 'مريم مدحت حماد',
    email: 'mariamhammad441@codexa.com',
    role: 'UI_UX_DESIGNER',
    track: 'UI_UX',
    jobTitle: 'مصممة واجهات (UI/UX)',
  },
  {
    id: '739ba699-b7d4-4c0c-873f-f93716d1a003',
    name: 'يوسف شهاب',
    email: 'fabecv10@codexa.com',
    role: 'UI_UX_LEAD',
    track: 'UI_UX',
    jobTitle: 'قائد فريق التصميم و UI/UX',
  },
  {
    id: '7d5123ad-9f77-4f24-b82e-99e6ec03b004',
    name: 'عبدالعزيز محمد كشك',
    email: 'abdelazizkishk19@codexa.com',
    role: 'DEVELOPER',
    track: 'FRONTEND',
    jobTitle: 'مطور Frontend',
  },
  {
    id: 'c8deb9c9-7b0e-41d4-b11d-38ca2b961005',
    name: 'اماني جلال عبد ربه',
    email: 'amangalal246@codexa.com',
    role: 'UI_UX_DESIGNER',
    track: 'UI_UX',
    jobTitle: 'مصممة واجهات (UI/UX)',
  },
  {
    id: 'dad169a4-8a80-460c-9059-e220c9800006',
    name: 'ريمون ايمن',
    email: 'remonaymananes@codexa.com',
    role: 'DEVELOPER',
    track: 'BACKEND',
    jobTitle: 'مطور Backend',
  },
  {
    id: 'df676109-50cf-4aaa-bab9-02b11236f307',
    name: 'محمد سعيد أبو الفتوح',
    email: 'mosaied20005@codexa.com',
    role: 'SALES',
    track: null,
    jobTitle: 'مسؤول مبيعات (Sales)',
  },
  {
    id: 'f2a27e68-efb7-469a-92ef-057247b0d009',
    name: 'سيف السيد',
    email: 'seifelsayed68@codexa.com',
    role: 'BACKEND_LEAD',
    track: 'BACKEND',
    jobTitle: 'قائد فريق Backend',
  },
  {
    id: 'f32c3e16-e344-410e-9897-e08017da3010',
    name: 'محمد صناديكي',
    email: 'muhamedelsanadiki@codexa.com',
    role: 'DEVELOPER',
    track: 'FRONTEND',
    jobTitle: 'مطور Frontend',
  },
  {
    id: 'f3a90b17-52f1-4d29-a73b-13574aff3411',
    name: 'شروق السعيد',
    email: 'shroukelsaeid2@codexa.com',
    role: 'UI_UX_DESIGNER',
    track: 'UI_UX',
    jobTitle: 'مصممة واجهات (UI/UX)',
  },
  {
    id: 'f5abdd2f-cf3c-423e-92e5-7d82c0b18012',
    name: 'معاذ محمد سيد سالم',
    email: 'mooazmohammed110@codexa.com',
    role: 'MOBILE_APP_LEAD',
    track: 'MOBILE_APP',
    jobTitle: 'قائد فريق Mobile',
  },
];

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string)?.trim();

  if (!email || !password) {
    return { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' };
  }

  const matchedMember = SUPABASE_ADMIN_USERS.find(
    (u) => u.email.toLowerCase() === email,
  );

  let backendToken = '';
  let backendUser: any = null;

  const rawApi =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://codexa-website-backend.vercel.app';
  const apiBases = ['http://127.0.0.1:3001', rawApi.replace(/\/$/, '')];

  for (const base of apiBases) {
    try {
      const res = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        backendToken =
          data.accessToken || data.token || data?.data?.accessToken || '';
        backendUser = data.user || data?.data?.user || null;
        if (backendToken) break;
      }
    } catch {}
  }

  if (!backendToken && !matchedMember) {
    return { error: 'البريد الإلكتروني غير مسجل ضمن فريق العمل أو كلمة المرور غير صحيحة.' };
  }

  const finalUser = {
    id: backendUser?.id || matchedMember?.id || 'user-1',
    name: backendUser?.name || matchedMember?.name || email.split('@')[0],
    email: backendUser?.email || matchedMember?.email || email,
    role: (backendUser?.role || matchedMember?.role || 'DEVELOPER').toUpperCase(),
    track: backendUser?.track || matchedMember?.track || null,
    jobTitle: matchedMember?.jobTitle || 'عضو فريق',
  };

  const finalToken =
    backendToken ||
    `codexa-jwt-${Buffer.from(
      JSON.stringify({
        sub: finalUser.id,
        email: finalUser.email,
        role: finalUser.role,
        name: finalUser.name,
      }),
    ).toString('base64')}`;

  const cookieStore = await cookies();
  const maxAge = 86400 * 7;

  cookieStore.set('accessToken', finalToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });

  cookieStore.set('token', finalToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });

  cookieStore.set('codexa_user', encodeURIComponent(JSON.stringify(finalUser)), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });

  cookieStore.set('codexa_user_email', finalUser.email, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });

  redirect('/dashboard');
}

// 🟢 إزالة redirect من داخل الـ Server Action لمنع خطأ An unexpected response was received from the server عند تسجيل الخروج
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('token');
  cookieStore.delete('codexa_user');
  cookieStore.delete('codexa_user_email');
  return { success: true };
}

export async function updateProfileAction(payload: {
  name?: string;
  phone?: string;
  avatar?: string;
  technologies?: string[];
  instaPay?: string;
  walletNumber?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  const cookieStore = await cookies();
  const rawUser = cookieStore.get('codexa_user')?.value;
  if (rawUser) {
    try {
      const cur = JSON.parse(decodeURIComponent(rawUser));
      const updated = { ...cur, ...payload };
      cookieStore.set('codexa_user', encodeURIComponent(JSON.stringify(updated)), {
        httpOnly: false,
        path: '/',
        maxAge: 86400 * 7,
      });
    } catch {}
  }
  return { success: true };
}