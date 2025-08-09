import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// Kolory:
// Pomarańczowy: #FF7A00
// Pomarańczowy ciemniejszy (hover): #E86A00

export default function Home() {
  return (
    <div className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <Link href="/" className="text-2xl font-bold text-[#FF7A00]">
          Handy
        </Link>
        <nav className="flex gap-6 text-gray-600">
          <Link href="/przegladaj" className="hover:text-[#FF7A00] transition py-4">
            Przeglądaj
          </Link>
          <Link
            href="/dodaj-ogloszenie"
            className="hover:text-[#FF7A00] transition py-4"
          >
            Dodaj ogłoszenie
          </Link>
          <Link
            href="/login"
            className="bg-[#FF7A00] text-white px-4 py-4 rounded hover:bg-[#E86A00] transition"
          >
            Zaloguj się
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Znajdź fachowca lub zlecenie
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Łączymy specjalistów i osoby szukające pomocy w domu, ogrodzie,
          budowie oraz wielu innych branżach. Dodaj ogłoszenie lub przeglądaj
          dostępne zlecenia.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/map"
            className="bg-[#FF7A00] text-white px-6 py-3 rounded-lg hover:bg-[#E86A00] transition"
          >
            Sprawdz Mape
          </Link>
          <Link
            href="/dodaj-ogloszenie"
            className="border border-[#FF7A00] text-[#FF7A00] px-6 py-3 rounded-lg hover:bg-[#FFF2E6] transition"
          >
            Dodaj ogłoszenie
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-4 text-sm text-gray-500 border-t border-gray-200 bg-white">
        © {new Date().getFullYear()} FixlyPro – Wszystkie prawa zastrzeżone
      </footer>
    </div>
  );
}
