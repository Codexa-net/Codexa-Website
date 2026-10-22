import { cookies } from 'next/headers';

// قائمة أعضاء الفريق الـ 12 الحقيقيين المسجلين في جدول admin_users على Supabase
export const SUPABASE_TEAM_USERS = [
  {
    id: 'ebb68484-a5b3-450c-84b9-2bfae2430008',
    name: 'عمر القاضي',
    email: 'alqadi@codexa.net',
    role: 'SUPER_ADMIN',
    track: 'FULL_STACK',
    jobTitle: 'مدير نظام (Super Admin)',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: '356b33c8-f3f1-4244-b060-2c84e1329001',
    name: 'فارس محمد سعيد الشرقاوي',
    email: 'fareselsharkawy517@codexa.com',
    role: 'GRAPHIC_DESIGNER',
    track: 'UI_UX',
    cvUrl: '#graphic',
    jobTitle: 'مصمم جرافيك (Graphic Designer)',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: '46f234d0-4a10-4f32-a39e-d33b49ee0002',
    name: 'مريم مدحت حماد',
    email: 'mariamhammad441@codexa.com',
    role: 'UI_UX_DESIGNER',
    track: 'UI_UX',
    jobTitle: 'مصممة واجهات (UI/UX)',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: '739ba699-b7d4-4c0c-873f-f93716d1a003',
    name: 'يوسف شهاب',
    email: 'fabecv10@codexa.com',
    role: 'UI_UX_LEAD',
    track: 'UI_UX',
    jobTitle: 'قائد فريق التصميم و UI/UX',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: '7d5123ad-9f77-4f24-b82e-99e6ec03b004',
    name: 'عبدالعزيز محمد كشك',
    email: 'abdelazizkishk19@codexa.com',
    role: 'DEVELOPER',
    track: 'FRONTEND',
    jobTitle: 'مطور Frontend',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'c8deb9c9-7b0e-41d4-b11d-38ca2b961005',
    name: 'اماني جلال عبد ربه',
    email: 'amangalal246@codexa.com',
    role: 'UI_UX_DESIGNER',
    track: 'UI_UX',
    jobTitle: 'مصممة واجهات (UI/UX)',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'dad169a4-8a80-460c-9059-e220c9800006',
    name: 'ريمون ايمن',
    email: 'remonaymananes@codexa.com',
    role: 'DEVELOPER',
    track: 'BACKEND',
    jobTitle: 'مطور Backend',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'df676109-50cf-4aaa-bab9-02b11236f307',
    name: 'محمد سعيد أبو الفتوح',
    email: 'mosaied20005@codexa.com',
    role: 'SALES',
    track: null,
    jobTitle: 'مسؤول مبيعات (Sales)',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'f2a27e68-efb7-469a-92ef-057247b0d009',
    name: 'سيف السيد',
    email: 'seifelsayed68@codexa.com',
    role: 'BACKEND_LEAD',
    track: 'BACKEND',
    jobTitle: 'قائد فريق Backend',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'f32c3e16-e344-410e-9897-e08017da3010',
    name: 'محمد صناديكي',
    email: 'muhamedelsanadiki@codexa.com',
    role: 'DEVELOPER',
    track: 'FRONTEND',
    jobTitle: 'مطور Frontend',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'f3a90b17-52f1-4d29-a73b-13574aff3411',
    name: 'شروق السعيد',
    email: 'shroukelsaeid2@codexa.com',
    role: 'UI_UX_DESIGNER',
    track: 'UI_UX',
    jobTitle: 'مصممة واجهات (UI/UX)',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'f5abdd2f-cf3c-423e-92e5-7d82c0b18012',
    name: 'معاذ محمد سيد سالم',
    email: 'mooazmohammed110@codexa.com',
    role: 'MOBILE_APP_LEAD',
    track: 'MOBILE_APP',
    jobTitle: 'قائد فريق Mobile',
    technologies: [],
    status: 'ACTIVE',
    isActive: true,
  },
];

const FALLBACK_PROJECTS: any[] = [];
const FALLBACK_CLIENTS: any[] = [];
const INITIAL_MESSAGES: any[] = [];

const globalForStore = globalThis as unknown as {
  __codexaMessages?: typeof INITIAL_MESSAGES;
};
if (!globalForStore.__codexaMessages) {
  globalForStore.__codexaMessages = [...INITIAL_MESSAGES];
}

export async function resolveLoggedUserFromCookies() {
  try {
    const cookieStore = await cookies();

    const rawUser = cookieStore.get('codexa_user')?.value;
    if (rawUser) {
      const parsed = JSON.parse(decodeURIComponent(rawUser));
      if (parsed?.email) {
        const matched = SUPABASE_TEAM_USERS.find(
          (u) => u.email.toLowerCase() === parsed.email.toLowerCase(),
        );
        return { ...matched, ...parsed };
      }
    }

    const userEmail = cookieStore.get('codexa_user_email')?.value;
    if (userEmail) {
      const matched = SUPABASE_TEAM_USERS.find(
        (u) => u.email.toLowerCase() === userEmail.toLowerCase(),
      );
      if (matched) return matched;
    }

    const token =
      cookieStore.get('accessToken')?.value ||
      cookieStore.get('token')?.value ||
      '';

    if (token) {
      let payloadText = '';
      if (token.startsWith('codexa-jwt-')) {
        payloadText = Buffer.from(token.replace('codexa-jwt-', ''), 'base64').toString('utf-8');
      } else if (token.includes('.')) {
        const parts = token.split('.');
        if (parts.length >= 2) {
          payloadText = Buffer.from(parts[1], 'base64').toString('utf-8');
        }
      }

      if (payloadText) {
        const decoded = JSON.parse(payloadText);
        const email = decoded.email || decoded.username;
        if (email) {
          const matched = SUPABASE_TEAM_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase(),
          );
          if (matched) return matched;
        }
      }
    }
  } catch {}

  return null;
}

async function handleFallbackRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<unknown> {
  const clean = endpoint.toLowerCase();
  const method = (options.method || 'GET').toUpperCase();
  const messagesStore = globalForStore.__codexaMessages!;

  if (
    clean.includes('/auth/me') ||
    clean.includes('/auth/profile') ||
    clean.includes('/users/me') ||
    clean === '/profile'
  ) {
    const u = await resolveLoggedUserFromCookies();
    return u || SUPABASE_TEAM_USERS[0];
  }

  if (clean.includes('/contact') || clean.includes('/messages')) {
    if (method === 'POST' && options.body) {
      try {
        const body = JSON.parse(String(options.body));
        const newMsg = {
          id: `msg-${Date.now()}`,
          name: body.name || 'عميل جديد',
          email: body.email || '',
          phone: body.phone || '',
          subject: body.subject || 'طلب مشروع جديد',
          projectType: body.projectType || 'مشروع رقمي',
          message: body.message || '',
          status: body.status || 'جديد',
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        messagesStore.unshift(newMsg);
        return newMsg;
      } catch {}
    }

    if (method === 'PATCH') {
      const idMatch = endpoint.match(/\/([^/?]+)(?:\/read)?$/);
      const targetId = idMatch?.[1];
      if (targetId) {
        let statusUpdate: string | undefined;
        try {
          if (options.body) {
            const parsed = JSON.parse(String(options.body));
            statusUpdate = parsed.status;
          }
        } catch {}

        globalForStore.__codexaMessages = messagesStore.map((m) =>
          m.id === targetId
            ? {
                ...m,
                isRead: true,
                status: statusUpdate || m.status,
              }
            : m,
        );
      }
      return { success: true };
    }

    if (method === 'DELETE') {
      const idMatch = endpoint.match(/\/([^/?]+)$/);
      const targetId = idMatch?.[1];
      if (targetId) {
        globalForStore.__codexaMessages = messagesStore.filter(
          (m) => m.id !== targetId,
        );
      }
      return { success: true };
    }

    return globalForStore.__codexaMessages;
  }

  if (
    clean.includes('/admin-users') ||
    clean.includes('/team') ||
    clean.includes('/users')
  ) {
    return SUPABASE_TEAM_USERS;
  }

  if (clean.includes('/projects')) {
    return FALLBACK_PROJECTS;
  }

  if (clean.includes('/clients')) {
    return FALLBACK_CLIENTS;
  }

  if (clean.includes('/wallet') || clean.includes('/transactions')) {
    const user = await resolveLoggedUserFromCookies();
    return {
      user: user || SUPABASE_TEAM_USERS[0],
      balance: 0,
      totalEarned: 0,
      pendingAmount: 0,
      transactions: [],
    };
  }

  if (clean.includes('/stats') || clean.includes('/dashboard') || clean.includes('/overview')) {
    const user = await resolveLoggedUserFromCookies();
    return {
      user: user || SUPABASE_TEAM_USERS[0],
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalClients: 0,
      projects: [],
      clients: [],
      messages: globalForStore.__codexaMessages,
    };
  }

  return [];
}

export async function serverFetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const isProd = process.env.NODE_ENV === 'production';
  const configuredBaseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://codexa-website-backend.vercel.app';

  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  let token = '';
  try {
    const cookieStore = await cookies();
    token =
      cookieStore.get('accessToken')?.value ||
      cookieStore.get('token')?.value ||
      '';
  } catch {}

  const headers = new Headers(options.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (
    options.body &&
    !headers.has('Content-Type') &&
    !(options.body instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // على فيرسل نتصل بالباك إند الحي فوراً بدون إضاعة الوقت في localhost
  const candidateBases = Array.from(
    new Set(
      [
        configuredBaseUrl.replace(/\/+$/, ''),
        'https://codexa-website-backend.vercel.app',
        !isProd ? 'http://127.0.0.1:3001' : '',
      ].filter(Boolean),
    ),
  );

  for (const baseUrl of candidateBases) {
    try {
      const response = await fetch(`${baseUrl}${normalizedEndpoint}`, {
        ...options,
        headers,
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const responseText = await response.text();
        if (responseText.trim()) {
          try {
            const parsed = JSON.parse(responseText);
            return parsed as T;
          } catch {
            return responseText as unknown as T;
          }
        }
        return {} as T;
      }
    } catch {
      // الانتقال للرابط التالي بهدوء
    }
  }

  return (await handleFallbackRequest(normalizedEndpoint, options)) as T;
}