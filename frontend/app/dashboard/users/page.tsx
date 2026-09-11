import UsersTable from "@/components/users/UsersTable";
import { serverFetchApi } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let users = [];
  try {
    // جلب المستخدمين بأمان من السيرفر الداخلي
    const res = await serverFetchApi("/admin-users");
    users = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
  } catch (err) {
    console.error("فشل جلب المستخدمين:", err);
  }

  return (
    <div className="max-w-6xl mx-auto" dir="rtl">
      {/* تمرير البيانات الجاهزة للجدول */}
      <UsersTable initialUsers={users} />
    </div>
  );
}