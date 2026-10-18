'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || 'بيانات الدخول غير صحيحة' };
    }

    // تم تعديل هذه الخطوة لإضافة await لـ cookies لأنها أصبحت Asynchronous
    const cookieStore = await cookies();
    cookieStore.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.expiresIn || 3600,
      path: '/',
    });

  } catch (error: unknown) {
    // لو الخطأ سببه الـ redirect خليه يكمل عادي ومايعتبروش إيرور اتصال
    if (
      typeof error === 'object' &&
      error !== null &&
      'digest' in error &&
      typeof (error as { digest?: unknown }).digest === 'string' &&
      (error as { digest: string }).digest.includes('NEXT_REDIRECT')
    ) {
      throw error;
    }
    return { error: 'تعذر الاتصال بالخادم' };
  }

  redirect('/dashboard');
}
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  redirect('/login');
}

export async function updateProfileAction(payload: {
  name?: string;
  phone?: string;
  avatar?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return { error: 'جلسة تسجيل الدخول انتهت، يرجى تسجيل الدخول مجدداً.' };
  }

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = Array.isArray(data.message)
        ? data.message.join('، ')
        : data.message;
      return { error: message || 'فشل تحديث الملف الشخصي.' };
    }

    return { data };
  } catch {
    return { error: 'تعذر الاتصال بالخادم.' };
  }
}
