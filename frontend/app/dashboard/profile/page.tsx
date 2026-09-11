import ProfileClient from './ProfileClient';
import { serverFetchApi } from '@/lib/server-api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CurrentAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  phone?: string | null;
}

type AuthResponse =
  | CurrentAdmin
  | {
      data?: CurrentAdmin | null;
    };

type ProfilePayload = {
  name?: string;
  phone?: string;
  avatar?: string | null;
  currentPassword?: string;
  newPassword?: string;
};

function unwrapAdmin(response: AuthResponse): CurrentAdmin | null {
  if (
    response &&
    typeof response === 'object' &&
    'data' in response
  ) {
    return response.data ?? null;
  }

  return response as CurrentAdmin;
}

export default async function ProfilePage() {
  let user: CurrentAdmin | null = null;

  try {
    const response = await serverFetchApi<AuthResponse>(
      '/auth/me',
    );

    user = unwrapAdmin(response);
  } catch {
    user = null;
  }

  if (!user) {
    redirect('/login');
  }

  async function updateProfile(
    _id: string,
    payload: ProfilePayload,
  ) {
    'use server';

    try {
      const response =
        await serverFetchApi<CurrentAdmin>(
          '/auth/profile',
          {
            method: 'PUT',
            body: JSON.stringify(payload),
          },
        );

      revalidatePath('/dashboard', 'layout');

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'فشل تحديث البيانات.',
      };
    }
  }

  return (
    <ProfileClient
      initialUser={user}
      updateAction={updateProfile}
    />
  );
}