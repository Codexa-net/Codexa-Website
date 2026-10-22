'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  MessageSquare,
  Moon,
  Sun,
  User,
  LogOut,
  Mail,
  CheckCheck,
  CheckCircle2,
  Coins,
  AlertTriangle,
  Send,
  Sparkles,
  ClipboardList,
  Menu,
} from 'lucide-react';
import { logoutAction } from '@/actions/auth';

const ROLE_TRANSLATIONS: Record<string, string> = {
  SUPER_ADMIN: 'مدير نظام (Super Admin)',
  UI_UX_DESIGNER: 'مصمم واجهات UI/UX',
  UI_UX: 'مصمم واجهات UI/UX',
  GRAPHIC_DESIGNER: 'مصمم جرافيك',
  UI_UX_LEAD: 'قائد فريق التصميم و UI/UX',
  FRONTEND_LEAD: 'قائد فريق Frontend',
  BACKEND_LEAD: 'قائد فريق Backend',
  FULL_STACK_LEAD: 'قائد فريق Full-Stack',
  MOBILE_APP_LEAD: 'قائد فريق Mobile',
  DEVELOPER: 'مطور برمجيات',
  SALES_LEADER: 'مشرف مبيعات',
  SALES: 'مسؤول مبيعات',
  PROJECT_MANAGER: 'مدير مشاريع',
};

// الدليل المعتمد للفريق بدون فرض أي صورة ثابتة لأي عضو
const TEAM_DIRECTORY = [
  {
    id: 'ebb68484-a5b3-450c-84b9-2bfae2430008',
    name: 'عمر القاضي',
    email: 'alqadi@codexa.net',
    role: 'SUPER_ADMIN',
    track: 'FULL_STACK',
    avatar: null,
    jobTitle: 'مدير نظام (Super Admin)',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: '739ba699-b7d4-4c0c-873f-f93716d1a003',
    name: 'يوسف شهاب',
    email: 'fabecv10@codexa.com',
    role: 'UI_UX_LEAD',
    track: 'UI_UX',
    avatar: null,
    jobTitle: 'قائد فريق التصميم و UI/UX',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'f2a27e68-efb7-469a-92ef-057247b0d009',
    name: 'سيف السيد',
    email: 'seifelsayed68@codexa.com',
    role: 'BACKEND_LEAD',
    track: 'BACKEND',
    avatar: null,
    jobTitle: 'قائد فريق Backend',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'f5abdd2f-cf3c-423e-92e5-7d82c0b18012',
    name: 'معاذ محمد سيد سالم',
    email: 'mooazmohammed110@codexa.com',
    role: 'MOBILE_APP_LEAD',
    track: 'MOBILE_APP',
    avatar: null,
    jobTitle: 'قائد فريق Mobile',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: '356b33c8-f3f1-4244-b060-2c84e1329001',
    name: 'فارس محمد سعيد الشرقاوي',
    email: 'fareselsharkawy517@codexa.com',
    role: 'GRAPHIC_DESIGNER',
    track: 'UI_UX',
    avatar: null,
    cvUrl: '#graphic',
    jobTitle: 'مصمم جرافيك (Graphic Designer)',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: '46f234d0-4a10-4f32-a39e-d33b49ee0002',
    name: 'مريم مدحت حماد',
    email: 'mariamhammad441@codexa.com',
    role: 'UI_UX_DESIGNER',
    track: 'UI_UX',
    avatar: null,
    jobTitle: 'مصمم واجهات (UI/UX)',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'c8deb9c9-7b0e-41d4-b11d-38ca2b961005',
    name: 'اماني جلال عبد ربه',
    email: 'amangalal246@codexa.com',
    role: 'UI_UX_DESIGNER',
    track: 'UI_UX',
    avatar: null,
    jobTitle: 'مصمم واجهات (UI/UX)',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'f3a90b17-52f1-4d29-a73b-13574aff3411',
    name: 'شروق السعيد',
    email: 'shroukelsaeid2@codexa.com',
    role: 'UI_UX_DESIGNER',
    track: 'UI_UX',
    avatar: null,
    jobTitle: 'مصمم واجهات (UI/UX)',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: '7d5123ad-9f77-4f24-b82e-99e6ec03b004',
    name: 'عبدالعزيز محمد كشك',
    email: 'abdelazizkishk19@codexa.com',
    role: 'DEVELOPER',
    track: 'FRONTEND',
    avatar: null,
    jobTitle: 'مطور Frontend',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'f32c3e16-e344-410e-9897-e08017da3010',
    name: 'محمد صناديكي',
    email: 'muhamedelsanadiki@codexa.com',
    role: 'DEVELOPER',
    track: 'FRONTEND',
    avatar: null,
    jobTitle: 'مطور Frontend',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'dad169a4-8a80-460c-9059-e220c9800006',
    name: 'ريمون ايمن',
    email: 'remonaymananes@codexa.com',
    role: 'DEVELOPER',
    track: 'BACKEND',
    avatar: null,
    jobTitle: 'مطور Backend',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
  {
    id: 'df676109-50cf-4aaa-bab9-02b11236f307',
    name: 'محمد سعيد أبو الفتوح',
    email: 'mosaied20005@codexa.com',
    role: 'SALES',
    track: null,
    avatar: null,
    jobTitle: 'مسؤول مبيعات (Sales)',
    technologies: [],
    phone: null,
    status: 'ACTIVE',
    isActive: true,
  },
];

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function findMemberInDirectory(candidate: any) {
  if (!candidate) return null;
  const cId = String(candidate.id || candidate.sub || candidate.userId || '').trim();
  const cEmail = String(candidate.email || candidate.username || '').trim().toLowerCase();
  const cName = String(candidate.name || '').trim();

  return (
    TEAM_DIRECTORY.find(
      (k) =>
        (cId && k.id === cId) ||
        (cEmail && k.email.toLowerCase() === cEmail) ||
        (cName && k.name.trim() === cName),
    ) || null
  );
}

function decodeJwtFromClient(): any {
  try {
    const token =
      getCookie('accessToken') ||
      getCookie('token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      '';
    if (!token) return null;

    let base64 = '';
    if (token.startsWith('codexa-jwt-')) {
      base64 = token.replace('codexa-jwt-', '');
    } else if (token.includes('.')) {
      base64 = token.split('.')[1];
    }
    if (!base64) return null;

    const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// قراءة الصورة الخاصة بمستخدم محدد فقط دون الخلط بين الحسابات على نفس المتصفح
function getUserScopedAvatar(userId?: string, email?: string, serverAvatar?: string | null): string {
  if (typeof window === 'undefined') return serverAvatar || '';
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanId = (userId || '').trim();

  try {
    const rawOv = localStorage.getItem('codexa_users_overrides');
    if (rawOv) {
      const overrides = JSON.parse(rawOv);
      const userOv = (cleanId && overrides[cleanId]) || (cleanEmail && overrides[cleanEmail]);
      if (userOv && userOv.avatar !== undefined) {
        return userOv.avatar || '';
      }
    }

    if (cleanEmail) {
      const scopedByEmail = localStorage.getItem(`codexa_avatar_${cleanEmail}`);
      if (scopedByEmail !== null) return scopedByEmail;
    }
    if (cleanId) {
      const scopedById = localStorage.getItem(`codexa_avatar_${cleanId}`);
      if (scopedById !== null) return scopedById;
    }
  } catch {}

  return serverAvatar || '';
}

// حفظ صورة المستخدم في مساره المعزول وفي سجل الفريق ليراها أعضاء فريقه والسوبر أدمن
function saveUserScopedAvatar(userId?: string, email?: string, avatarValue?: string | null) {
  if (typeof window === 'undefined') return;
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanId = (userId || '').trim();
  const val = avatarValue || '';

  try {
    if (cleanEmail) {
      if (val) localStorage.setItem(`codexa_avatar_${cleanEmail}`, val);
      else localStorage.removeItem(`codexa_avatar_${cleanEmail}`);
    }
    if (cleanId) {
      if (val) localStorage.setItem(`codexa_avatar_${cleanId}`, val);
      else localStorage.removeItem(`codexa_avatar_${cleanId}`);
    }

    const rawOv = localStorage.getItem('codexa_users_overrides');
    const overrides = rawOv ? JSON.parse(rawOv) : {};

    if (cleanId) {
      overrides[cleanId] = { ...(overrides[cleanId] || {}), avatar: val || null };
    }
    if (cleanEmail) {
      overrides[cleanEmail] = { ...(overrides[cleanEmail] || {}), avatar: val || null };
    }

    localStorage.setItem('codexa_users_overrides', JSON.stringify(overrides));
  } catch {}
}

function getRoleSortPriority(role?: string): number {
  const r = (role || '').toUpperCase();
  if (r === 'SUPER_ADMIN') return 0;
  if (r.endsWith('_LEAD') || r === 'SALES_LEADER') return 1;
  return 2;
}

function enrichTeamList(rawList: any[], viewerRole?: string): any[] {
  let overrides: Record<string, any> = {};
  let deletedIds: string[] = [];

  try {
    const rawOv = localStorage.getItem('codexa_users_overrides');
    const rawDel = localStorage.getItem('codexa_users_deleted');
    if (rawOv) overrides = JSON.parse(rawOv);
    if (rawDel) deletedIds = JSON.parse(rawDel);
  } catch {}

  const baseList = rawList && rawList.length > 0 ? rawList : TEAM_DIRECTORY;

  const mapped = baseList
    .filter((u) => !deletedIds.includes(String(u.id)))
    .map((u) => {
      const known = findMemberInDirectory(u);
      const resolvedId = String(u.id || known?.id || '');
      const emailLower = (u.email || known?.email || '').trim().toLowerCase();
      const ov = overrides[resolvedId] || overrides[emailLower] || {};

      let rawMergedRole = (ov.role || u.role || known?.role || 'DEVELOPER').toUpperCase();
      if (emailLower === 'mooazmohammed110@codexa.com' && rawMergedRole === 'DEVELOPER') {
        rawMergedRole = 'MOBILE_APP_LEAD';
      }

      let mergedTrack = ov.track !== undefined ? ov.track : (u.track || known?.track || null);
      let mergedCvUrl = ov.cvUrl !== undefined ? ov.cvUrl : (u.cvUrl || known?.cvUrl || null);

      if (rawMergedRole === 'GRAPHIC_DESIGNER') {
        mergedTrack = 'UI_UX';
        mergedCvUrl = mergedCvUrl?.includes('#graphic')
          ? mergedCvUrl
          : (mergedCvUrl || '') + '#graphic';
      } else if (rawMergedRole === 'UI_UX_DESIGNER' || rawMergedRole === 'UI_UX') {
        mergedTrack = 'UI_UX';
      } else if (rawMergedRole === 'UI_UX_LEAD') {
        mergedTrack = 'UI_UX';
      } else if (rawMergedRole === 'FRONTEND_LEAD') {
        mergedTrack = 'FRONTEND';
      } else if (rawMergedRole === 'BACKEND_LEAD') {
        mergedTrack = 'BACKEND';
      } else if (rawMergedRole === 'MOBILE_APP_LEAD') {
        mergedTrack = 'MOBILE_APP';
      } else if (rawMergedRole === 'FULL_STACK_LEAD') {
        mergedTrack = 'FULL_STACK';
      }

      const realTechs = Array.isArray(ov.technologies)
        ? ov.technologies
        : Array.isArray(u.technologies)
          ? u.technologies
          : [];

      // جلب صورة العضو الخاصة به فقط (من السيرفر أو من تعديله الشخصي المحفوظ)
      const memberAvatar = getUserScopedAvatar(resolvedId, emailLower, u.avatar);
      const isLeadMember = rawMergedRole.endsWith('_LEAD') || rawMergedRole === 'SALES_LEADER';

      return {
        ...known,
        ...u,
        ...ov,
        id: resolvedId,
        name: ov.name || u.name || known?.name,
        email: ov.email || u.email || known?.email,
        role: rawMergedRole,
        isLead: isLeadMember,
        track: mergedTrack,
        avatar: memberAvatar || null,
        cvUrl: mergedCvUrl,
        phone: ov.phone !== undefined ? ov.phone : (u.phone || null),
        technologies: realTechs,
        skills: realTechs,
        isActive: ov.isActive !== undefined ? ov.isActive : (u.isActive ?? true),
      };
    })
    .sort((a, b) => getRoleSortPriority(a.role) - getRoleSortPriority(b.role));

  const vRole = (viewerRole || '').toUpperCase();
  if (vRole === 'UI_UX_LEAD') {
    return mapped.filter((m) => m.track === 'UI_UX');
  }
  if (vRole === 'BACKEND_LEAD') {
    return mapped.filter((m) => m.track === 'BACKEND' || m.track === 'FULL_STACK');
  }
  if (vRole === 'FRONTEND_LEAD') {
    return mapped.filter((m) => m.track === 'FRONTEND' || m.track === 'FULL_STACK');
  }
  if (vRole === 'FULL_STACK_LEAD') {
    return mapped.filter(
      (m) => m.track === 'FULL_STACK' || m.track === 'FRONTEND' || m.track === 'BACKEND',
    );
  }
  if (vRole === 'MOBILE_APP_LEAD') {
    return mapped.filter((m) => m.track === 'MOBILE_APP');
  }

  return mapped;
}

export function syncAndProtectClientSession(serverUserProp?: any) {
  if (typeof window === 'undefined') return TEAM_DIRECTORY[0];

  const win = window as unknown as {
    __codexaActiveUser?: any;
    __codexaOriginalFetch?: typeof window.fetch;
  };

  let resolvedUser: any = null;

  try {
    if (
      serverUserProp &&
      serverUserProp.name &&
      serverUserProp.name !== 'المستخدم' &&
      serverUserProp.name !== 'عضو الفريق'
    ) {
      const matched = findMemberInDirectory(serverUserProp);
      const uId = serverUserProp.id || matched?.id || '';
      const uEmail = serverUserProp.email || matched?.email || '';
      let role = (serverUserProp.role || matched?.role || 'DEVELOPER').toUpperCase();
      if (uEmail.toLowerCase() === 'mooazmohammed110@codexa.com' && role === 'DEVELOPER') {
        role = 'MOBILE_APP_LEAD';
      }
      resolvedUser = {
        ...(matched || {}),
        ...serverUserProp,
        id: uId,
        name: serverUserProp.name || matched?.name,
        email: uEmail,
        role,
        avatar: getUserScopedAvatar(uId, uEmail, serverUserProp.avatar),
        track: serverUserProp.track || matched?.track || null,
      };
    }

    if (!resolvedUser) {
      const cookieUserRaw = getCookie('codexa_user');
      if (cookieUserRaw) {
        const parsed = JSON.parse(cookieUserRaw);
        const matched = findMemberInDirectory(parsed);
        if (matched || parsed?.email) {
          const uId = parsed.id || matched?.id || '';
          const uEmail = parsed.email || matched?.email || '';
          let role = (parsed.role || matched?.role || 'DEVELOPER').toUpperCase();
          if (uEmail.toLowerCase() === 'mooazmohammed110@codexa.com' && role === 'DEVELOPER') {
            role = 'MOBILE_APP_LEAD';
          }
          resolvedUser = {
            ...(matched || {}),
            ...parsed,
            id: uId,
            name: parsed.name || matched?.name,
            email: uEmail,
            role,
            avatar: getUserScopedAvatar(uId, uEmail, parsed.avatar),
            track: parsed.track || matched?.track || null,
          };
        }
      }
    }

    if (!resolvedUser) {
      const jwtDecoded = decodeJwtFromClient();
      const matchedFromJwt = findMemberInDirectory(jwtDecoded);
      if (matchedFromJwt) {
        resolvedUser = {
          ...matchedFromJwt,
          avatar: getUserScopedAvatar(matchedFromJwt.id, matchedFromJwt.email, null),
        };
      }
    }

    if (!resolvedUser) {
      const localRaw = localStorage.getItem('user') || localStorage.getItem('codexa_user');
      if (localRaw) {
        const parsed = JSON.parse(localRaw);
        const matched = findMemberInDirectory(parsed);
        if (matched) {
          let role = (parsed.role || matched.role).toUpperCase();
          if (
            matched.email.toLowerCase() === 'mooazmohammed110@codexa.com' &&
            role === 'DEVELOPER'
          ) {
            role = 'MOBILE_APP_LEAD';
          }
          resolvedUser = {
            ...matched,
            ...parsed,
            id: matched.id,
            email: matched.email,
            role,
            avatar: getUserScopedAvatar(matched.id, matched.email, parsed.avatar),
            track: parsed.track || matched.track,
          };
        }
      }
    }

    if (resolvedUser) {
      const emailLower = (resolvedUser.email || '').toLowerCase();
      const scopedAvatar = getUserScopedAvatar(
        resolvedUser.id,
        emailLower,
        resolvedUser.avatar,
      );
      resolvedUser.avatar = scopedAvatar || '';

      // синхronize active user's own avatar with localStorage so /dashboard/profile reads the right one
      const previousOwner = localStorage.getItem('codexa_avatar_owner');
      if (previousOwner !== emailLower) {
        localStorage.setItem('codexa_avatar_owner', emailLower);
        if (scopedAvatar) {
          localStorage.setItem('codexa_avatar', scopedAvatar);
          localStorage.setItem('user_avatar', scopedAvatar);
        } else {
          localStorage.removeItem('codexa_avatar');
          localStorage.removeItem('user_avatar');
        }
      }

      win.__codexaActiveUser = resolvedUser;

      const token =
        getCookie('accessToken') ||
        getCookie('token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken') ||
        `codexa-session-${resolvedUser.id}`;

      localStorage.setItem('token', token);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(resolvedUser));
      localStorage.setItem('codexa_user', JSON.stringify(resolvedUser));
      localStorage.setItem('userRole', resolvedUser.role);
      localStorage.setItem('userId', resolvedUser.id);
      localStorage.setItem('userName', resolvedUser.name);

      // حفظ الكوكي بدون وضع صورة Base64 ضخمة بداخلها حتى لا تتجاوز حد الـ 4KB للكوكيز
      const compactAvatar =
        resolvedUser.avatar && !String(resolvedUser.avatar).startsWith('data:')
          ? resolvedUser.avatar
          : '';

      document.cookie = `codexa_user=${encodeURIComponent(
        JSON.stringify({
          id: resolvedUser.id,
          name: resolvedUser.name,
          email: resolvedUser.email,
          role: resolvedUser.role,
          avatar: compactAvatar,
          track: resolvedUser.track,
        }),
      )}; path=/; max-age=604800; SameSite=Lax`;
    }
  } catch {}

  const activeUser = resolvedUser || win.__codexaActiveUser || TEAM_DIRECTORY[0];

  if (!win.__codexaOriginalFetch) {
    win.__codexaOriginalFetch = window.fetch.bind(window);
  }
  const nativeFetch = win.__codexaOriginalFetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const isExternalApi =
      url.includes(':3001') ||
      url.includes('codexa-website-backend.vercel.app') ||
      url.includes('/auth/me') ||
      url.includes('/auth/profile') ||
      url.includes('/project-stages') ||
      url.includes('/contact-messages') ||
      url.includes('/admin-users') ||
      url.includes('/projects');

    if (!isExternalApi) {
      return nativeFetch(input, init);
    }

    const lower = url.toLowerCase();
    const method = (init?.method || 'GET').toUpperCase();
    const currentActive =
      win.__codexaActiveUser ||
      JSON.parse(localStorage.getItem('user') || 'null') ||
      activeUser;
    const currentViewerRole = (currentActive?.role || 'DEVELOPER').toUpperCase();

    // 🟢 التقاط أي تحديث للصورة الشخصية أو البروفايل وحفظه للعضو نفسه ليظهر لكل فريقه وللسوبر أدمن
    if (
      (method === 'PUT' || method === 'PATCH' || method === 'POST') &&
      (lower.includes('/auth/profile') ||
        lower.includes('/auth/me') ||
        lower.includes('/admin-users/')) &&
      init?.body &&
      typeof init.body === 'string'
    ) {
      try {
        const parsedBody = JSON.parse(init.body);
        if ('avatar' in parsedBody) {
          const targetId = currentActive?.id;
          const targetEmail = currentActive?.email;
          saveUserScopedAvatar(targetId, targetEmail, parsedBody.avatar);
        }
      } catch {}
    }

    if (lower.includes('/auth/me') || lower.includes('/auth/profile')) {
      try {
        const res = await nativeFetch(input, init);
        if (res.ok) {
          const clone = res.clone();
          const data = await clone.json().catch(() => null);
          const serverU = data?.data ?? data;
          if (serverU && serverU.email) {
            const matched = findMemberInDirectory(serverU);
            const uId = serverU.id || matched?.id || '';
            const uEmail = serverU.email || matched?.email || '';
            let role = (serverU.role || matched?.role || currentViewerRole).toUpperCase();
            if (uEmail.toLowerCase() === 'mooazmohammed110@codexa.com' && role === 'DEVELOPER') {
              role = 'MOBILE_APP_LEAD';
            }
            const userAvatar = getUserScopedAvatar(uId, uEmail, serverU.avatar);
            if (serverU.avatar) {
              saveUserScopedAvatar(uId, uEmail, serverU.avatar);
            }
            const merged = {
              ...(matched || {}),
              ...serverU,
              id: uId,
              email: uEmail,
              role,
              avatar: userAvatar,
              track: serverU.track || matched?.track || null,
            };
            win.__codexaActiveUser = merged;
            localStorage.setItem('user', JSON.stringify(merged));
            localStorage.setItem('userRole', merged.role);
            return new Response(JSON.stringify({ ...merged, data: merged }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
      } catch {}

      return new Response(JSON.stringify({ ...currentActive, data: currentActive }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const res = await nativeFetch(input, init);
      if (res.ok) {
        if (
          lower.includes('/admin-users') &&
          !lower.includes('/transactions') &&
          method === 'GET'
        ) {
          const clone = res.clone();
          const json = await clone.json().catch(() => null);
          const rawArr = Array.isArray(json)
            ? json
            : Array.isArray(json?.data)
              ? json.data
              : [];
          const enriched = enrichTeamList(rawArr, currentViewerRole);
          return new Response(JSON.stringify(enriched), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (
          lower.includes('/projects') &&
          !lower.includes('ispublic=true') &&
          method === 'GET'
        ) {
          const clone = res.clone();
          const json = await clone.json().catch(() => null);
          const rawArr = Array.isArray(json)
            ? json
            : Array.isArray(json?.data)
              ? json.data
              : [];
          const internalOnly = rawArr.filter(
            (p: any) => p.isPublic !== true && p.isPublic !== 'true',
          );
          return new Response(JSON.stringify(internalOnly), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return res;
      }
    } catch {}

    let safePayload: unknown = [];

    if (lower.includes('/transactions')) {
      safePayload = [];
    } else if (
      lower.includes('/admin-users') ||
      lower.includes('/team') ||
      lower.includes('/users')
    ) {
      safePayload = enrichTeamList(TEAM_DIRECTORY, currentViewerRole);
    } else if (lower.includes('/projects')) {
      safePayload = [];
    } else if (lower.includes('/wallet')) {
      safePayload = {
        user: currentActive,
        balance: currentActive?.walletBalance || 0,
        totalEarned: 0,
        pendingAmount: 0,
        transactions: [],
      };
    } else if (lower.includes('/project-stages/live-updates')) {
      safePayload = { data: [] };
    }

    return new Response(JSON.stringify(safePayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  return activeUser;
}

export interface AppNotification {
  id: string;
  type: 'TASK_ASSIGNED' | 'TASK_REVIEW' | 'TASK_APPROVED' | 'TASK_REVISION' | 'PAYOUT' | 'MESSAGE';
  title: string;
  body: string;
  link: string;
  createdAt: string;
  isRead: boolean;
}

function playNotificationChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch {}
}

export default function TopNav({ user }: { user?: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dashTheme, setDashTheme] = useState<'dark' | 'light'>('dark');

  const [activeMenu, setActiveMenu] = useState<'notifications' | 'user' | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevCountRef = useRef<number | null>(null);
  const isFirstLoadRef = useRef(true);

  if (typeof window !== 'undefined' && user?.name && user.name !== 'المستخدم') {
    syncAndProtectClientSession(user);
  }

  const [currentUser, setCurrentUser] = useState(() => {
    const matched = findMemberInDirectory(user);
    const uId = user?.id || matched?.id || '';
    const email = user?.email || matched?.email || '';

    return {
      id: uId,
      name: user?.name || matched?.name || 'عضو الفريق',
      email: email,
      role: (user?.role || matched?.role || 'DEVELOPER').toUpperCase(),
      avatar: getUserScopedAvatar(uId, email, user?.avatar),
    };
  });

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || 'https://codexa-website-backend.vercel.app';

  const getAuthHeaders = () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') || localStorage.getItem('accessToken')
        : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
    return headers;
  };

  useEffect(() => {
    const synced = syncAndProtectClientSession(user);
    if (synced?.name) {
      const scopedAvatar = getUserScopedAvatar(synced.id, synced.email, synced.avatar);

      setCurrentUser({
        id: synced.id,
        name: synced.name,
        email: synced.email || '',
        role: (synced.role || 'DEVELOPER').toUpperCase(),
        avatar: scopedAvatar,
      });
      window.dispatchEvent(new Event('codexaUserSynced'));
    }
  }, [user]);

  // 🟢 الاستماع لتغيير أو حذف الصورة من صفحة الملف الشخصي وربطها بحساب العضو الحالي فقط
  useEffect(() => {
    const handleAvatarUpdate = () => {
      try {
        const activeRaw = localStorage.getItem('user') || localStorage.getItem('codexa_user');
        const parsedUser = activeRaw ? JSON.parse(activeRaw) : null;
        const uId = parsedUser?.id || currentUser.id;
        const uEmail = (parsedUser?.email || currentUser.email || '').toLowerCase();

        // قراءة الصورة الجديدة التي رفعتها صفحة الملف الشخصي (أو الفارغة عند الضغط على إزالة الصورة)
        const latestAvatar =
          localStorage.getItem('codexa_avatar') ??
          localStorage.getItem('user_avatar') ??
          parsedUser?.avatar ??
          '';

        saveUserScopedAvatar(uId, uEmail, latestAvatar);
        localStorage.setItem('codexa_avatar_owner', uEmail);

        if (parsedUser) {
          parsedUser.avatar = latestAvatar;
          localStorage.setItem('user', JSON.stringify(parsedUser));
          localStorage.setItem('codexa_user', JSON.stringify(parsedUser));
        }

        setCurrentUser((prev) => ({ ...prev, avatar: latestAvatar }));

        // إرسال التحديث للباك إند ليظهر لباقي أعضاء التيم على أجهزتهم أيضاً
        if (uId) {
          fetch(`${API_BASE}/admin-users/${uId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify({ avatar: latestAvatar || null }),
          }).catch(() => null);
        }
      } catch {}
    };

    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    window.addEventListener('profileUpdated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
      window.removeEventListener('profileUpdated', handleAvatarUpdate);
    };
  }, [API_BASE, currentUser.id, currentUser.email]);

  const rawRole = (currentUser.role || 'DEVELOPER').toUpperCase();
  const isSalesOrAdmin =
    rawRole === 'SUPER_ADMIN' || rawRole === 'SALES' || rawRole === 'SALES_LEADER';

  const applyDashboardTheme = useCallback((themeMode: 'dark' | 'light') => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  const toggleDashboardTheme = () => {
    const next = dashTheme === 'dark' ? 'light' : 'dark';
    setDashTheme(next);
    localStorage.setItem('dashboard_theme', next);
    applyDashboardTheme(next);
  };

  const fetchAllNotifications = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const notifs: AppNotification[] = [];

      const stagesRes = await fetch(`${API_BASE}/project-stages/live-updates`, {
        headers,
        credentials: 'include',
      }).catch(() => null);

      if (stagesRes && stagesRes.ok) {
        const stageData = await stagesRes.json().catch(() => ({}));
        const stagesList = Array.isArray(stageData?.data)
          ? stageData.data
          : Array.isArray(stageData)
            ? stageData
            : [];

        stagesList.forEach((s: any) => {
          const readKey = `notif_read_${s.id}_${s.status || s.progress}`;
          if (localStorage.getItem(readKey) === 'true') return;

          if (
            (s.assignedUserId === currentUser.id || s.assignedTo === currentUser.name) &&
            s.progress === 0 &&
            !s.isCompleted
          ) {
            notifs.push({
              id: `assign_${s.id}`,
              type: 'TASK_ASSIGNED',
              title: 'مهمة جديدة مسندة إليك',
              body: `تم إسناد مهمة "${s.title}" إليك في مشروع ${s.project?.name || ''}.`,
              link: '/dashboard/tasks',
              createdAt: s.createdAt || new Date().toISOString(),
              isRead: false,
            });
          }

          if (
            rawRole === `${s.track}_LEAD` &&
            s.isUnderReview &&
            !s.isLeadApproved &&
            s.assignedUserId !== currentUser.id
          ) {
            notifs.push({
              id: `review_${s.id}`,
              type: 'TASK_REVIEW',
              title: 'مهمة مكتملة بانتظار اعتمادك',
              body: `سلم ${s.assignedUser?.name || s.assignedTo || 'المنفذ'} مهمة "${s.title}" للمراجعة.`,
              link: '/dashboard/tasks',
              createdAt: s.updatedAt || new Date().toISOString(),
              isRead: false,
            });
          }

          if (rawRole === 'SUPER_ADMIN' && s.isLeadApproved && !s.isPaid) {
            notifs.push({
              id: `payout_ready_${s.id}`,
              type: 'TASK_APPROVED',
              title: 'مهمة معتمدة وبانتظار الصرف',
              body: `تم الاعتماد الفني لمهمة "${s.title}". بانتظار أمر صرف (${s.reward || 0} ج.م).`,
              link: '/dashboard/tasks',
              createdAt: s.updatedAt || new Date().toISOString(),
              isRead: false,
            });
          }

          if (
            (s.assignedUserId === currentUser.id || s.assignedTo === currentUser.name) &&
            s.feedback &&
            !s.isLeadApproved
          ) {
            notifs.push({
              id: `feedback_${s.id}`,
              type: 'TASK_REVISION',
              title: 'ملاحظات وتعديل مطلوب',
              body: `أرسل المشرف ملاحظات على مهمة "${s.title}": ${s.feedback}`,
              link: '/dashboard/tasks',
              createdAt: s.updatedAt || new Date().toISOString(),
              isRead: false,
            });
          }

          if (
            (s.assignedUserId === currentUser.id || s.assignedTo === currentUser.name) &&
            s.isPaid
          ) {
            notifs.push({
              id: `paid_${s.id}`,
              type: 'PAYOUT',
              title: 'تم إيداع المستحقات بنجاح',
              body: `تم إيداع ${s.reward || 0} ج.م في محفظتك عن إنجاز مهمة "${s.title}".`,
              link: '/dashboard/wallet',
              createdAt: s.updatedAt || new Date().toISOString(),
              isRead: false,
            });
          }
        });
      }

      if (isSalesOrAdmin) {
        const msgRes = await fetch(`${API_BASE}/contact-messages`, {
          headers,
          credentials: 'include',
        }).catch(() => null);

        if (msgRes && msgRes.ok) {
          const msgData = await msgRes.json().catch(() => ({}));
          const msgList = Array.isArray(msgData?.data)
            ? msgData.data
            : Array.isArray(msgData)
              ? msgData
              : [];

          msgList
            .filter(
              (m: any) => !m.isRead && localStorage.getItem(`msg_read_${m.id}`) !== 'true',
            )
            .forEach((m: any) => {
              notifs.push({
                id: `msg_${m.id}`,
                type: 'MESSAGE',
                title: 'طلب تواصل جديد من عميل',
                body: `${m.name}: ${m.subject || 'استفسار عن خدمات كوديكسا'}`,
                link: '/dashboard/messages',
                createdAt: m.createdAt || new Date().toISOString(),
                isRead: false,
              });
            });
        }
      }

      if (!isFirstLoadRef.current && notifs.length > (prevCountRef.current || 0)) {
        playNotificationChime();
      }

      prevCountRef.current = notifs.length;
      isFirstLoadRef.current = false;
      setNotifications(notifs);
    } catch {}
  }, [API_BASE, currentUser.id, currentUser.name, rawRole, isSalesOrAdmin]);

  useEffect(() => {
    setMounted(true);
    const savedDashTheme =
      (localStorage.getItem('dashboard_theme') as 'dark' | 'light') || 'dark';
    setDashTheme(savedDashTheme);
    applyDashboardTheme(savedDashTheme);

    fetchAllNotifications();

    const interval = setInterval(fetchAllNotifications, 15000);
    const handleSync = () => fetchAllNotifications();
    window.addEventListener('messagesUpdated', handleSync);
    window.addEventListener('tasksUpdated', handleSync);

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      window.removeEventListener('messagesUpdated', handleSync);
      window.removeEventListener('tasksUpdated', handleSync);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fetchAllNotifications, applyDashboardTheme]);

  const handleNotificationClick = (item: AppNotification) => {
    try {
      localStorage.setItem(`notif_read_${item.id}`, 'true');
      if (item.id.startsWith('msg_')) {
        localStorage.setItem(item.id.replace('msg_', 'msg_read_'), 'true');
      }
    } catch {}

    setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    setActiveMenu(null);
    router.push(item.link);
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      try {
        localStorage.setItem(`notif_read_${n.id}`, 'true');
        if (n.id.startsWith('msg_')) {
          localStorage.setItem(n.id.replace('msg_', 'msg_read_'), 'true');
        }
      } catch {}
    });
    setNotifications([]);
    setActiveMenu(null);
  };

  const toggleMenu = (menu: 'notifications' | 'user') => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  // 🟢 تسجيل خروج نظيف يمسح الجلسة والمفاتيح المؤقتة حتى لا تظهر صورة المستخدم السابق للمستخدم الجديد
  async function handleLogout() {
    try {
      const win = window as unknown as { __codexaActiveUser?: any };
      win.__codexaActiveUser = undefined;
      localStorage.removeItem('user');
      localStorage.removeItem('codexa_user');
      localStorage.removeItem('codexa_avatar');
      localStorage.removeItem('user_avatar');
      localStorage.removeItem('codexa_avatar_owner');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      document.cookie = 'accessToken=; Max-Age=0; path=/';
      document.cookie = 'token=; Max-Age=0; path=/';
      document.cookie = 'codexa_user=; Max-Age=0; path=/';
      document.cookie = 'codexa_user_email=; Max-Age=0; path=/';
      await logoutAction().catch(() => null);
    } catch {}
    window.location.replace('/login');
  }

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <ClipboardList size={15} className="text-blue-500" />;
      case 'TASK_REVIEW':
        return <Send size={15} className="text-amber-500" />;
      case 'TASK_APPROVED':
        return <CheckCircle2 size={15} className="text-emerald-500" />;
      case 'TASK_REVISION':
        return <AlertTriangle size={15} className="text-rose-500" />;
      case 'PAYOUT':
        return <Coins size={15} className="text-emerald-400" />;
      case 'MESSAGE':
        return <Mail size={15} className="text-purple-500" />;
    }
  };

  const displayRole = ROLE_TRANSLATIONS[rawRole] || currentUser.role || 'عضو الفريق';
  const firstLetter = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'ع';
  const unreadCount = notifications.length;

  return (
    <header
      className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-gray-100 bg-white/95 px-3 sm:px-6 md:px-8 backdrop-blur-md transition-colors dark:border-gray-800 dark:bg-[#0d111a]/95"
      dir="rtl"
    >
      {/* زر القائمة الجانبية في شاشات الموبايل */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('toggleSidebar'))}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
          aria-label="فتح القائمة"
        >
          <Menu size={18} />
        </button>
        <span className="font-black text-sm sm:text-base tracking-tight text-gray-900 dark:text-white md:hidden font-sans">
          Codexa
        </span>
      </div>

      <div ref={containerRef} className="flex items-center gap-1.5 sm:gap-3.5">
        <div className="flex items-center gap-1 sm:gap-2 border-e border-gray-200 pe-1.5 sm:pe-4 dark:border-gray-700">
          {mounted && (
            <button
              type="button"
              onClick={toggleDashboardTheme}
              className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              title="مظهر الداشبورد"
            >
              {dashTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu('notifications')}
              className="relative flex h-8.5 w-8.5 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="الإشعارات"
            >
              <Bell size={16} />
              {unreadCount > 0 ? (
                <span className="absolute -end-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-black text-white shadow-md ring-2 ring-white dark:ring-[#0d111a]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                  <span className="relative z-10">{unreadCount > 9 ? '+9' : unreadCount}</span>
                </span>
              ) : (
                <span
                  className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0d111a]"
                  title="جميع التحديثات مقروءة"
                />
              )}
            </button>

            {activeMenu === 'notifications' && (
              <div className="animate-in fade-in zoom-in-95 fixed inset-x-3 top-15 z-50 w-auto max-w-[calc(100vw-1.5rem)] sm:absolute sm:inset-x-auto sm:end-0 sm:top-11 sm:w-88 sm:max-w-none rounded-3xl border border-gray-200/80 bg-white p-4 text-right shadow-2xl duration-150 dark:border-gray-800 dark:bg-[#111827]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                      <Sparkles size={14} className="text-brand-500 shrink-0" />
                      <span>مركز التحديثات والمهام</span>
                    </span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                        {unreadCount} جديد
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-gray-400 transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      <CheckCheck size={13} />
                      قراءة الكل
                    </button>
                  )}
                </div>

                <div className="mt-2 max-h-72 sm:max-h-80 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800/60">
                  {unreadCount > 0 ? (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleNotificationClick(n)}
                        className="group flex w-full cursor-pointer items-start gap-3 rounded-2xl px-2 py-3 text-right transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-1 space-y-0.5 overflow-hidden">
                          <p className="truncate text-xs font-bold text-gray-900 dark:text-gray-100">
                            {n.title}
                          </p>
                          <p className="line-clamp-2 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                            {n.body}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="space-y-1 py-8 text-center text-xs text-gray-400">
                      <CheckCircle2 className="mx-auto mb-2 size-7 text-emerald-500 opacity-80" />
                      <p className="font-bold text-gray-700 dark:text-gray-200">
                        لا توجد إشعارات جديدة
                      </p>
                      <p className="text-[10px] text-gray-400">
                        أنت مطلع على جميع المهام والعمليات أولاً بأول.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {isSalesOrAdmin && (
            <Link
              href="/dashboard/messages"
              className="relative flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800"
              title="إدارة طلبات التواصل والعملاء"
            >
              <MessageSquare size={16} />
            </Link>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu('user')}
            className="flex cursor-pointer items-center gap-2.5 rounded-full p-0.5 sm:p-1 hover:bg-gray-50 dark:hover:bg-gray-800/60"
          >
            <div className="relative flex h-8.5 w-8.5 sm:h-9 sm:w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-sm font-bold text-white shadow-sm ring-1 ring-brand-500/20">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={`صورة ${currentUser.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{firstLetter}</span>
              )}
            </div>

            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold dark:text-white leading-tight">
                {currentUser.name || 'عضو الفريق'}
              </div>
              <div className="text-[10px] text-gray-400">{displayRole}</div>
            </div>
          </button>

          {activeMenu === 'user' && (
            <div className="absolute end-0 top-11 sm:top-12 z-50 w-52 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl dark:border-gray-800 dark:bg-[#111827]">
              <div className="border-b border-gray-100 px-3 py-2 sm:hidden dark:border-gray-800">
                <p className="truncate text-xs font-bold text-gray-900 dark:text-white">
                  {currentUser.name || 'عضو الفريق'}
                </p>
                <p className="truncate text-[10px] text-gray-400">{displayRole}</p>
              </div>

              <Link
                href="/dashboard/profile"
                onClick={() => setActiveMenu(null)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <User size={15} />
                الملف الشخصي
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut size={15} />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}