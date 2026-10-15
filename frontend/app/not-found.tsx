import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f8fb] text-center dark:bg-[#0d0b1f] px-4" dir="rtl">
      <h1 className="text-6xl font-black text-[#14161f] dark:text-white">404</h1>
      <p className="text-base font-bold text-[#8b8f9c] dark:text-gray-400">
        الصفحة أو المشروع غير موجود
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-full bg-brand-600 px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-700 shadow-sm"
      >
        العودة للوحة التحكم
      </Link>
    </div>
  );
}