import { NextResponse } from 'next/server';
import { serverFetchApi } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const endpoints = ['/admin/messages?limit=10', '/messages', '/contact'];

  for (const ep of endpoints) {
    try {
      const res = await serverFetchApi(ep);
      const list = Array.isArray(res) ? res : res?.data;
      if (Array.isArray(list)) {
        const notifications = list.map((m: any) => ({
          id: String(m.id),
          name: m.name || 'عميل جديد',
          subject: m.subject || 'طلب مشروع جديد',
          createdAt: m.createdAt || new Date().toISOString(),
          isRead: Boolean(m.isRead),
        }));
        return NextResponse.json(notifications);
      }
    } catch {}
  }

  return NextResponse.json([]);
}