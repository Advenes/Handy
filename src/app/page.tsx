// src/app/page.tsx
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={`${inter.className} flex flex-col items-center justify-center px-6 text-center min-h-screen pb-40 animate-fade-in`}>
      <h1 className="text-5xl font-bold mb-4 text-gray-900">
        Znajdź fachowca lub zlecenie
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8 animate-slide-up" style={{ animationDelay: "60ms" }}>
        Łączymy specjalistów i osoby szukające pomocy w domu, ogrodzie,
        budowie oraz wielu innych branżach. Dodaj ogłoszenie lub przeglądaj
        dostępne zlecenia.
      </p>
      <div className="flex gap-4 flex-wrap justify-center animate-slide-up" style={{ animationDelay: "120ms" }}>
        <Link
          href="/wyszukaj"
          className="bg-[#FF7A00] text-white px-6 py-3 rounded-lg hover:bg-[#E86A00] transition hover-lift"
        >
          Sprawdź Mapę
        </Link>
        <Link
          href="/addRequest"
          className="border border-[#FF7A00] text-[#FF7A00] px-6 py-3 rounded-lg hover:bg-[#FFF2E6] transition hover-lift"
        >
          Dodaj ogłoszenie
        </Link>
      </div>
    </div>
  );
}
