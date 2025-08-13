"use client";

import React, { useState, FormEvent } from "react";
import { Inter } from "next/font/google";
 

const inter = Inter({ subsets: ["latin"] });

const categories = ["Sprzątanie", "Naprawa", "Budowa", "Ogrodnictwo", "Inne"];
const urgencyLevels = [
  { label: "Niska", value: "low" },
  { label: "Średnia", value: "medium" },
  { label: "Wysoka", value: "high" },
];

export default function AddAnnouncementPage() {
  
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [money, setMoney] = useState<number | "">("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  // Nota bene: upload plików wyłączony w tej iteracji
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setFiles(e.target.files);
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!category || !title || !description) {
      setMsg("Proszę wypełnić wszystkie wymagane pola.");
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const payload = {
        category,
        title,
        description,
        urgency,
        money: money === "" ? null : money,
        addressLine1,
        city,
        postalCode,
        country,
      };

      const res = await fetch("/api/addAnnouncement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg(`Sukces! ID ogłoszenia: ${data.id}`);
        setCategory("");
        setTitle("");
        setDescription("");
        setUrgency("medium");
        setMoney("");
        setAddressLine1("");
        setCity("");
        setPostalCode("");
        setCountry("");
        // setFiles(null);
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

  return (
    <main className={`${inter.className} max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-12`}>
      <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Dodaj ogłoszenie</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Kategoria */}
        <label className="flex flex-col text-gray-700 font-medium text-sm">
          Kategoria pomocy
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="" disabled>Wybierz kategorię</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        {/* Temat */}
        <label className="flex flex-col text-gray-700 font-medium text-sm">
          Temat
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Wpisz temat ogłoszenia"
            className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </label>

        {/* Opis */}
        <label className="flex flex-col text-gray-700 font-medium text-sm">
          Opis
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            placeholder="Opisz dokładnie, na czym polega pomoc"
            className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </label>

        {/* Pilność */}
        <label className="flex flex-col text-gray-700 font-medium text-sm">
          Poziom pilności
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {urgencyLevels.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        {/* Kwota */}
        <label className="flex flex-col text-gray-700 font-medium text-sm">
          Kwota (PLN)
          <input
            type="number"
            value={money}
            onChange={(e) =>
              setMoney(e.target.value === "" ? "" : Number(e.target.value))
            }
            min={0}
            step={0.01}
            placeholder="Podaj kwotę"
            className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </label>

        {/* Adres */}
        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col text-gray-700 font-medium text-sm">
            Ulica i numer
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              required
              placeholder="np. Jana Pawła II 10/2"
              className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col text-gray-700 font-medium text-sm md:col-span-2">
              Miasto
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="np. Warszawa"
                className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </label>
            <label className="flex flex-col text-gray-700 font-medium text-sm">
              Kod pocztowy
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                placeholder="np. 00-001"
                pattern="^[0-9]{2}-[0-9]{3}$"
                className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </label>
          </div>
          <label className="flex flex-col text-gray-700 font-medium text-sm">
            Kraj
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              placeholder="np. Polska"
              className="mt-2 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>

        {/* Załączniki */}
        {/* Upload plików wyłączony */}

        {/* Komunikat */}
        {msg && (
          <p
            className={`mt-2 text-center ${msg.startsWith("Sukces") ? "text-green-600" : "text-red-600"}`}
          >
            {msg}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-[#FF7A00] hover:bg-[#E86A00] transition text-white font-semibold py-3 rounded-md shadow-md disabled:opacity-50"
        >
          {loading ? "Wysyłam..." : "Dodaj ogłoszenie"}
        </button>
      </form>
    </main>
  );
}
