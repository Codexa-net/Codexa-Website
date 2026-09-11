'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type UserPayload = {
  name: string;
  email: string;
  role: string;
  password?: string;
  phone?: string;
  isActive?: boolean;
};

async function backendRequest(path: string, options: RequestInit = {}) {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return { error: 'جلسة تسجيل الدخول انتهت، يرجى تسجيل الدخول مجدداً.' };
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join('، ')
      : data.message;
    return { error: message || 'فشل تنفيذ العملية.' };
  }

  return { data };
}

export async function createUserAction(payload: UserPayload) {
  const result = await backendRequest('/admin-users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!result.error) revalidatePath('/dashboard/users');
  return result;
}

export async function updateUserAction(
  id: string,
  payload: Partial<UserPayload>,
) {
  const result = await backendRequest(`/admin-users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (!result.error) revalidatePath('/dashboard/users');
  return result;
}

export async function deleteUserAction(id: string) {
  const result = await backendRequest(`/admin-users/${id}`, {
    method: 'DELETE',
  });

  if (!result.error) revalidatePath('/dashboard/users');
  return result;
}