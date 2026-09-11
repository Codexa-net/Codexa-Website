export function Pagination({
  total,
  shown,
  page = 1,
}: {
  total: number;
  shown: number;
  page?: number;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border-subtle px-6 py-4 text-sm text-[#8b8f9c]">
      <div className="flex items-center gap-1">
        <button className="rounded-lg px-3 py-1.5 hover:bg-gray-50">السابق</button>
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            className={
              n === page
                ? "rounded-lg bg-brand-500 px-3 py-1.5 font-bold text-white"
                : "rounded-lg px-3 py-1.5 hover:bg-gray-50"
            }
          >
            {n}
          </button>
        ))}
        <span className="px-1">...</span>
        <button className="rounded-lg px-3 py-1.5 hover:bg-gray-50">التالي</button>
      </div>
      <p>
        عرض {shown} من {total} إجمالي
      </p>
    </div>
  );
}
