"use client";

import { X } from "lucide-react";
import { Button } from "./Button";

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  itemLabel,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemLabel: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-right">
        <button
          onClick={onClose}
          className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600"
        >
          <X size={18} />
        </button>
        <h2 className="text-2xl font-extrabold text-[#14161f]">هل متأكد من حذف {itemLabel}؟</h2>
        <p className="mt-3 text-sm text-[#8b8f9c]">
          عند حذف {itemLabel} لا يمكن الرجوع لها بعد ذلك
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="primary" className="flex-1" onClick={onClose}>
            تراجع
          </Button>
          <Button variant="danger-outline" className="flex-1" onClick={onConfirm}>
            حذف {itemLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
