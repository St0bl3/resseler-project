import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#02030a] px-4 text-slate-50">
      <div className="max-w-lg rounded-lg border border-white/10 bg-white/[0.035] p-8 text-center shadow-[0_0_60px_rgba(8,145,178,.12)]">
        <CheckCircle2 className="mx-auto size-14 text-emerald-300" />
        <h1 className="mt-5 text-3xl font-black">Оплата принята</h1>
        <p className="mt-3 leading-7 text-slate-300">
          После успешной оплаты ключи автоматически уйдут на email покупателя.
        </p>
        <Link className="primary-button mt-7 inline-flex" href="/">
          Вернуться в магазин
        </Link>
      </div>
    </main>
  );
}
