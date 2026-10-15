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
} from 'lucide-react';
import { logoutAction } from '@/actions/auth';

const ROLE_TRANSLATIONS: Record<string, string> = {
  SUPER_ADMIN: 'مدير نظام (Super Admin)',
  UI_UX_DESIGNER: 'مصمم واجهات UI/UX',
  GRAPHIC_DESIGNER: 'مصمم جرافيك',
  UI_UX_LEAD: 'قائد فريق UI/UX',
  FRONTEND_LEAD: 'قائد فريق Frontend',
  BACKEND_LEAD: 'قائد فريق Backend',
  MOBILE_APP_LEAD: 'قائد فريق Mobile',
  DEVELOPER: 'مطور برمجيات',
  SALES_LEADER: 'مشرف مبيعات',
  SALES: 'مسؤول مبيعات',
  PROJECT_MANAGER: 'مدير مشاريع',
};

export interface AppNotification {
  id: string;
  type: 'TASK_ASSIGNED' | 'TASK_REVIEW' | 'TASK_APPROVED' | 'TASK_REVISION' | 'PAYOUT' | 'MESSAGE';
  title: string;
  body: string;
  link: string;
  createdAt: string;
  isRead: boolean;
}

// تشغيل نغمة إشعار احترافية وناعمة
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
    // نغمة صاعدة مريحة للأذن (Bell Chime)
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

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

  const [currentUser, setCurrentUser] = useState({
    id: user?.id || '',
    name: user?.name || '',
    role: user?.role || '',
    avatar: user?.avatar || '',
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('accessToken') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
    return headers;
  };

  useEffect(() => {
    if (user?.role) {
      setCurrentUser({
        id: user.id || '',
        name: user.name || '',
        role: user.role.toUpperCase(),
        avatar: user.avatar || '',
      });
    } else {
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('userRole');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setCurrentUser({
            id: parsed.id || '',
            name: parsed.name || '',
            role: (parsed.role || savedRole || '').toUpperCase(),
            avatar: parsed.avatar || '',
          });
        } catch {}
      } else if (savedRole) {
        setCurrentUser((prev) => ({ ...prev, role: savedRole.toUpperCase() }));
      }
    }
  }, [user]);

  const rawRole = (currentUser.role || '').toUpperCase();
  const isSalesOrAdmin = rawRole === 'SUPER_ADMIN' || rawRole === 'SALES' || rawRole === 'SALES_LEADER';

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

  // جلب وتوليد الإشعارات الذكية بحسب رتبة المستخدم الحالية
  const fetchAllNotifications = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const notifs: AppNotification[] = [];

      // 1. فحص تحديثات المهام الحية من السيرفر لجميع التيم
      const stagesRes = await fetch(`${API_BASE}/project-stages/live-updates`, {
        headers,
        credentials: 'include',
      }).catch(() => null);

      if (stagesRes && stagesRes.ok) {
        const stageData = await stagesRes.json();
        const stagesList = Array.isArray(stageData?.data) ? stageData.data : Array.isArray(stageData) ? stageData : [];

        stagesList.forEach((s: any) => {
          const readKey = `notif_read_${s.id}_${s.status || s.progress}`;
          if (localStorage.getItem(readKey) === 'true') return;

          // أ) للمنفذ: تم إسناد مهمة جديدة
          if ((s.assignedUserId === currentUser.id || s.assignedTo === currentUser.name) && s.progress === 0 && !s.isCompleted) {
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

          // ب) لليدر: المطور سلم المهمة وبانتظار المراجعة الفنية
          if (rawRole === `${s.track}_LEAD` && s.isUnderReview && !s.isLeadApproved && s.assignedUserId !== currentUser.id) {
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

          // ج) للسوبر أدمن: الليدر اعتمد المهمة وبانتظار صرف المستحقات
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

          // د) للمنفذ: تم طلب تعديل
          if ((s.assignedUserId === currentUser.id || s.assignedTo === currentUser.name) && s.feedback && !s.isLeadApproved) {
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

          // هـ) للمنفذ: تم صرف الفلوس للمحفظة
          if ((s.assignedUserId === currentUser.id || s.assignedTo === currentUser.name) && s.isPaid) {
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

      // 2. فحص رسائل واستفسارات العملاء للأدمن والمبيعات فقط
      if (isSalesOrAdmin) {
        const msgRes = await fetch(`${API_BASE}/contact-messages`, {
          headers,
          credentials: 'include',
        }).catch(() => null);

        if (msgRes && msgRes.ok) {
          const msgData = await msgRes.json();
          const msgList = Array.isArray(msgData?.data) ? msgData.data : Array.isArray(msgData) ? msgData : [];

          msgList
            .filter((m: any) => !m.isRead && localStorage.getItem(`msg_read_${m.id}`) !== 'true')
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

      // تشغيل الصوت عند وجود إشعار جديد لم يكن موجوداً من قبل
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
    const savedDashTheme = (localStorage.getItem('dashboard_theme') as 'dark' | 'light') || 'dark';
    setDashTheme(savedDashTheme);
    applyDashboardTheme(savedDashTheme);

    fetchAllNotifications();

    const interval = setInterval(fetchAllNotifications, 5000);
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
    } catch {}

    setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    setActiveMenu(null);
    router.push(item.link);
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      try {
        localStorage.setItem(`notif_read_${n.id}`, 'true');
      } catch {}
    });
    setNotifications([]);
    setActiveMenu(null);
  };

  const toggleMenu = (menu: 'notifications' | 'user') => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  async function handleLogout() {
    localStorage.clear();
    await logoutAction();
    router.push('/login');
    router.refresh();
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
      className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-8 transition-colors dark:border-gray-800 dark:bg-[#0d111a]"
      dir="rtl"
    >
      <div />

      <div ref={containerRef} className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-e border-gray-200 pe-4 dark:border-gray-700">
          {mounted && (
            <button
              type="button"
              onClick={toggleDashboardTheme}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              title="مظهر الداشبورد"
            >
              {dashTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          {/* أيقونة الجرس التفاعلية مع الصوت والبادج الحي */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu('notifications')}
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="الإشعارات"
            >
              <Bell size={17} />

              {unreadCount > 0 ? (
                <span className="absolute -top-1 -end-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-black text-white shadow-md ring-2 ring-white dark:ring-[#0d111a]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                  <span className="relative z-10">{unreadCount > 9 ? '+9' : unreadCount}</span>
                </span>
              ) : (
                <span
                  className="absolute end-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0d111a]"
                  title="جميع التحديثات مقروءة"
                />
              )}
            </button>

            {/* دروب داون الإشعارات بتصميم رايق وعصري */}
            {activeMenu === 'notifications' && (
              <div className="absolute end-0 top-11 z-50 w-88 rounded-3xl border border-gray-200/80 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-[#111827] text-right animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles size={14} className="text-brand-500" />
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
                      className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                    >
                      <CheckCheck size={13} />
                      قراءة الكل
                    </button>
                  )}
                </div>

                <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800/60 max-h-80 overflow-y-auto">
                  {unreadCount > 0 ? (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleNotificationClick(n)}
                        className="group flex w-full items-start gap-3 py-3 px-2 rounded-2xl text-right transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-1 overflow-hidden space-y-0.5">
                          <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {n.body}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-9 text-center text-xs text-gray-400 space-y-1">
                      <CheckCircle2 className="mx-auto size-7 text-emerald-500 mb-2 opacity-80" />
                      <p className="font-bold text-gray-700 dark:text-gray-200">لا توجد إشعارات جديدة</p>
                      <p className="text-[10px] text-gray-400">أنت مطلع على جميع المهام والعمليات أولاً بأول.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {isSalesOrAdmin && (
            <Link
              href="/dashboard/messages"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              title="إدارة طلبات التواصل والعملاء"
            >
              <MessageSquare size={17} />
            </Link>
          )}
        </div>

        {/* بروفايل المستخدم */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu('user')}
            className="flex cursor-pointer items-center gap-3 rounded-full p-1 hover:bg-gray-50 dark:hover:bg-gray-800/60"
          >
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-sm font-bold text-white shadow-sm">
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

            <div className="hidden text-right sm:block">
              <div className="text-xs font-bold dark:text-white">
                {currentUser.name || 'عضو الفريق'}
              </div>
              <div className="text-[10px] text-gray-400">
                {displayRole}
              </div>
            </div>
          </button>

          {activeMenu === 'user' && (
            <div className="absolute end-0 top-12 z-50 w-48 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl dark:border-gray-800 dark:bg-[#111827]">
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