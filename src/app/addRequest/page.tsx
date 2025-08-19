"use client";

import React, { useState, FormEvent, useEffect, ChangeEvent } from "react";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
 
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const categories = ["Sprzątanie", "Naprawa", "Budowa", "Ogrodnictwo", "Inne"];

export default function AddAnnouncementPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1); // 1..6
  
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [money, setMoney] = useState<number | "">("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [clientRequirements, setClientRequirements] = useState("");

  const [attachments, setAttachments] = useState<{ name: string; preview: string }[]>([]);

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userData");
      if (!raw) {
        setMsg("Musisz być zalogowany, aby dodać ogłoszenie.");
        return;
      }
      const user = JSON.parse(raw);
      setUserId(user.id || user.email || null);
      setUsername(user.username || user.email || null);
      setContactEmail(user.email || null);
    } catch {
      setMsg("Błąd odczytu danych użytkownika. Zaloguj się ponownie.");
    }
  }, []);

  const onFilesSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr: { name: string; preview: string }[] = [];
    Array.from(files).forEach((file) => {
      const preview = URL.createObjectURL(file);
      arr.push({ name: file.name, preview });
    });
    setAttachments((prev) => [...prev, ...arr]);
  };

  const removeAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!userId || !username || !contactEmail) {
      setMsg("Musisz być zalogowany, aby dodać ogłoszenie.");
      router.push("/login");
      return;
    }

    if (!category || !title || !description || !addressLine1 || !city || !postalCode || !country) {
      setMsg("Uzupełnij wszystkie wymagane pola.");
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const payload = {
        category,
        title,
        description,
        money: money === "" ? null : money,
        addressLine1,
        city,
        postalCode,
        country,
        userId,
        username,
        contactEmail,
        clientRequirements,
        attachments,
      };

      const res = await fetch("/api/addAnnouncement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg(`Sukces! Numer ogłoszenia: ${data.id}`);
        setCategory("");
        setTitle("");
        setDescription("");
        setMoney("");
        setAddressLine1("");
        setCity("");
        setPostalCode("");
        setCountry("");
        setClientRequirements("");
        setAttachments([]);
        setCurrentStep(1);
      } else {
        setMsg(`Błąd: ${data.message || "Coś poszło nie tak"}`);
      }
    } catch (error) {
      console.error(error);
      setMsg("Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.min(((currentStep - 1) / 5) * 100, 100);

  const goNext = () => setCurrentStep((s) => Math.min(5, s + 1));
  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1));

  const getSlideClasses = (index: number) => {
    const isActive = index === currentStep - 1;
    const isLeftOfActive = index < currentStep - 1;
    // Active fades in; slides to the left fade out; slides to the right are hidden until they enter
    return `w-full shrink-0 p-4 transition-opacity duration-700 ease-in-out ${
      isActive ? "opacity-100" : isLeftOfActive ? "opacity-0" : "opacity-0"
    }`;
  };

  // Step validation flags for enabling/disabling Next buttons
  const canProceedFromStep1 = Boolean(category && title);
  const canProceedFromStep2 = true; // wymagane pola: brak; kwota max opcjonalna
  const canProceedFromStep3 = true; // załączniki opcjonalne
  const canProceedFromStep4 = description.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl">
        {/* Gradient hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#FF7A00] to-[#FFB347] shadow-sm">
          <div className="px-6 py-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-white">Dodaj ogłoszenie w 60 sekund</h1>
            <p className="text-white/90 mt-1 text-sm">Krok po kroku – sekcje przesuwają się płynnie</p>
            <div className="mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/90" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        </div>

        <main className={`${poppins.className} px-6 py-6`}>
          {msg && (
            <div className={`mb-4 text-center text-sm ${msg.startsWith("Sukces") ? "text-green-600" : "text-red-600"}`}>{msg}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Slider wrapper */}
            <div className="relative overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-700 ease-in-out will-change-transform"
                style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}
              >
                {/* Slide 1 */}
                <div className={getSlideClasses(0)}>
                  <div className="bg-white border border-orange-100 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-[#FF7A00] uppercase tracking-wide mb-2">Krok 1</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col text-gray-700 font-medium text-sm">
                        Kategoria
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="" disabled>Wybierz kategorię</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-gray-700 font-medium text-sm">
          Temat
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Wpisz temat ogłoszenia" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </label>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <span />
                      <button
                        type="button"
                        disabled={!canProceedFromStep1}
                        onClick={goNext}
                        className="px-4 py-2 bg-[#FF7A00] hover:bg-[#E86A00] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                      >
                        Kontynuuj
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slide 2 */}
                <div className={getSlideClasses(1)}>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Krok 2</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col text-gray-700 font-medium text-sm">
                        Dodatkowe wymagania klienta
                        <textarea value={clientRequirements} onChange={(e) => setClientRequirements(e.target.value)} rows={3} placeholder="Np. własne narzędzia, określone godziny pracy…" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-orange-500" />
                      </label>
                      <label className="flex flex-col text-gray-700 font-medium text-sm">
                        Maksymalna kwota zapłaty (PLN)
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={money === "" ? "" : money}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") { setMoney(""); return; }
                            const n = Number(val);
                            if (!Number.isNaN(n)) setMoney(n);
                          }}
                          placeholder="np. 500"
                          className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </label>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button type="button" onClick={goPrev} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Wstecz</button>
                      <button
                        type="button"
                        disabled={!canProceedFromStep2}
                        onClick={goNext}
                        className="px-4 py-2 bg-[#FF7A00] hover:bg-[#E86A00] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                      >
                        Kontynuuj
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slide 3 */}
                <div className={getSlideClasses(2)}>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Krok 3</p>
                    <label className="block text-sm text-gray-700 mb-2">Załączniki (opcjonalnie)</label>
                    <input type="file" accept="image/*" multiple onChange={onFilesSelected} />
                    {attachments.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {attachments.map((a) => (
                          <div key={a.name} className="border rounded-md p-2 flex flex-col items-center gap-2">
                            <img src={a.preview} alt={a.name} className="w-full h-24 object-cover rounded" />
                            <button type="button" className="text-xs text-red-600" onClick={() => removeAttachment(a.name)}>Usuń</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex justify-between">
                      <button type="button" onClick={goPrev} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Wstecz</button>
                      <button
                        type="button"
                        disabled={!canProceedFromStep3}
                        onClick={goNext}
                        className="px-4 py-2 bg-[#FF7A00] hover:bg-[#E86A00] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                      >
                        Kontynuuj
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slide 4 */}
                <div className={getSlideClasses(3)}>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Krok 4</p>
                    <label className="flex flex-col text-gray-700 font-medium text-sm">
                      Opis
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} placeholder="Opisz dokładnie, na czym polega pomoc" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </label>
                    <div className="mt-4 flex justify-between">
                      <button type="button" onClick={goPrev} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Wstecz</button>
                      <button type="button" disabled={!canProceedFromStep4} onClick={goNext} className="px-4 py-2 bg-[#FF7A00] hover:bg-[#E86A00] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition">Kontynuuj</button>
                    </div>
                  </div>
                </div>

                {/* Slide 5 */}
                <div className={getSlideClasses(4)}>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Krok 5</p>
                    <div className="grid grid-cols-1 gap-4">
                      <label className="flex flex-col text-gray-700 font-medium text-sm">
                        Ulica i numer
                        <input type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required placeholder="np. Jana Pawła II 10/2" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex flex-col text-gray-700 font-medium text-sm md:col-span-2">
                          Miasto
                          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="np. Warszawa" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </label>
                        <label className="flex flex-col text-gray-700 font-medium text-sm">
                          Kod pocztowy
                          <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="np. 00-001" pattern="^[0-9]{2}-[0-9]{3}$" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </label>
                      </div>
                      <label className="flex flex-col text-gray-700 font-medium text-sm">
                        Kraj
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="np. Polska" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                      </label>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button type="button" onClick={goPrev} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Wstecz</button>
                      <button type="submit" disabled={loading} className="px-6 py-2 bg-[#FF7A00] hover:bg-[#E86A00] transition text-white font-semibold rounded-md shadow-md disabled:opacity-50">{loading ? "Wysyłam..." : "Dodaj ogłoszenie"}</button>
                    </div>
                  </div>
                </div>

                {/* Slide 6 */}
                <div className={getSlideClasses(5)}>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Krok 6</p>
        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col text-gray-700 font-medium text-sm">
            Ulica i numer
                        <input type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required placeholder="np. Jana Pawła II 10/2" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col text-gray-700 font-medium text-sm md:col-span-2">
              Miasto
                          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="np. Warszawa" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </label>
            <label className="flex flex-col text-gray-700 font-medium text-sm">
              Kod pocztowy
                          <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="np. 00-001" pattern="^[0-9]{2}-[0-9]{3}$" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </label>
          </div>
          <label className="flex flex-col text-gray-700 font-medium text-sm">
            Kraj
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="np. Polska" className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </label>
        </div>
                    <div className="mt-4 flex justify-between">
                      <button type="button" onClick={goPrev} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Wstecz</button>
                      <button type="submit" disabled={loading} className="px-6 py-2 bg-[#FF7A00] hover:bg-[#E86A00] transition text-white font-semibold rounded-md shadow-md disabled:opacity-50">{loading ? "Wysyłam..." : "Dodaj ogłoszenie"}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </form>
    </main>
      </div>
    </div>
  );
}
