'use client';

import { useEffect, useState } from 'react';

export const USER_ROLES = [
  { value: 'SUPER_ADMIN', label: 'مدير نظام (Super Admin)' },
  { value: 'SALES', label: 'موظف مبيعات (Sales)' },
];

export type EditableUser = {
  id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  isActive?: boolean;
};

type Props = {
  user?: EditableUser | null;
  pending?: boolean;
  onCancel: () => void;
  onSubmit: (payload: { name: string; email: string; role: string; password?: string; phone?: string; }) => void;
};

export default function UserForm({ user, pending = false, onCancel, onSubmit }: Props) {
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState(user?.role ?? 'SALES');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setRole(user?.role ?? 'SALES');
    setPhone(user?.phone ?? '');
    setPassword('');
  }, [user]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      name: name.trim(), email: email.trim().toLowerCase(), role,
      phone: phone.trim() || undefined, password: password.trim() || undefined,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4" dir="rtl">
      <div>
        <label className="mb-1 block text-xs font-bold">الاسم الكامل</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold">البريد الإلكتروني</label>
        <input required type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold">رقم الهاتف</label>
        <input dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold">الدور</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
          {USER_ROLES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold">كلمة المرور {user ? '(اختياري عند التعديل)' : ''}</label>
        <input required={!user} minLength={8} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
      </div>
      <div className="flex justify-start gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" onClick={onCancel} className="rounded-xl px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">إلغاء</button>
        <button type="submit" disabled={pending} className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700 cursor-pointer">{pending ? 'جاري الحفظ...' : user ? 'حفظ التعديلات' : 'إضافة المستخدم'}</button>
      </div>
    </form>
  );
}