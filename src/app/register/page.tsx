"use client";
import Link from "next/link";
import { useState } from "react";

type Role = "client" | "provider";
type Voivodeship = "dolnoslaskie" | "kujawsko-pomorskie" | "lubelskie" | "lubuskie" | "lodzkie" | "malopolskie" | "mazowieckie" | "opolskie" | "podkarpackie" | "podlaskie" | "pomorskie" | "slaskie" | "swietokrzyskie" | "warminsko-mazurskie" | "wielkopolskie" | "zachodniopomorskie";

const RegisterPage = () => {
  const [role, setRole] = useState<Role>("client");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [voivodeship, setVoivodeship] = useState<Voivodeship>("wielkopolskie");
  const [nip, setNip] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [businessStartDate, setBusinessStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!email || !validateEmail(email)) {
      newErrors.email = "Wprowadź poprawny adres email";
    }

    if (!phone || !validatePhone(phone)) {
      newErrors.phone = "Wprowadź poprawny numer telefonu (9 cyfr)";
    }

    if (!password || password.length < 6) {
      newErrors.password = "Hasło musi mieć co najmniej 6 znaków";
    }

    if (role === "provider") {
      if (!nip || nip.length < 10) {
        newErrors.nip = "NIP musi mieć co najmniej 10 znaków";
      }
      if (!companyName || companyName.length < 2) {
        newErrors.companyName = "Nazwa firmy musi mieć co najmniej 2 znaki";
      }
      if (!address || address.length < 5) {
        newErrors.address = "Adres musi mieć co najmniej 5 znaków";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const payload: {
        email: string;
        phone: string;
        password: string;
        role: Role;
        voivodeship: Voivodeship;
        nip?: string;
        companyName?: string;
        address?: string;
        businessStartDate?: string;
      } = { email, phone, password, role, voivodeship };
      
      if (role === "provider") {
        payload.nip = nip;
        payload.companyName = companyName;
        payload.address = address;
        payload.businessStartDate = businessStartDate;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Błąd rejestracji");
      setMessage("Konto utworzone. Możesz się zalogować.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Błąd rejestracji");
    } finally {
      setLoading(false);
    }
  };

  const voivodeships = [
    { value: "dolnoslaskie", label: "Dolnośląskie" },
    { value: "kujawsko-pomorskie", label: "Kujawsko-Pomorskie" },
    { value: "lubelskie", label: "Lubelskie" },
    { value: "lubuskie", label: "Lubuskie" },
    { value: "lodzkie", label: "Łódzkie" },
    { value: "malopolskie", label: "Małopolskie" },
    { value: "mazowieckie", label: "Mazowieckie" },
    { value: "opolskie", label: "Opolskie" },
    { value: "podkarpackie", label: "Podkarpackie" },
    { value: "podlaskie", label: "Podlaskie" },
    { value: "pomorskie", label: "Pomorskie" },
    { value: "slaskie", label: "Śląskie" },
    { value: "swietokrzyskie", label: "Świętokrzyskie" },
    { value: "warminsko-mazurskie", label: "Warmińsko-Mazurskie" },
    { value: "wielkopolskie", label: "Wielkopolskie" },
    { value: "zachodniopomorskie", label: "Zachodniopomorskie" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold text-center mb-1">Utwórz konto</h1>
        <p className="text-center text-gray-500 mb-6">Wybierz typ konta i wypełnij formularz</p>

        <div className="grid grid-cols-2 gap-2 mb-6" role="tablist" aria-label="Wybierz typ konta">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`px-4 py-2 rounded-lg border text-sm ${role === "client" ? "bg-[#FF7A00] text-white border-[#FF7A00]" : "bg-gray-100 text-gray-700 border-transparent"}`}
            aria-selected={role === "client"}
            role="tab"
          >
            Klient
          </button>
          <button
            type="button"
            onClick={() => setRole("provider")}
            className={`px-4 py-2 rounded-lg border text-sm ${role === "provider" ? "bg-[#FF7A00] text-white border-[#FF7A00]" : "bg-gray-100 text-gray-700 border-transparent"}`}
            aria-selected={role === "provider"}
            role="tab"
          >
            Fachowiec
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Numer telefonu *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="123456789"
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Województwo *</label>
            <select
              value={voivodeship}
              onChange={(e) => setVoivodeship(e.target.value as Voivodeship)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {voivodeships.map((voivodeshipOption) => (
                <option key={voivodeshipOption.value} value={voivodeshipOption.value}>
                  {voivodeshipOption.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hasło *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            <p className="text-gray-500 text-xs mt-1">Minimum 6 znaków</p>
          </div>

          {role === "provider" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Numer NIP *</label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nip ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nazwa firmy *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.companyName ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adres *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data rozpoczęcia działalności gospodarczej *</label>
                <input
                  type="date"
                  value={businessStartDate}
                  onChange={(e) => setBusinessStartDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {message && <p className="text-center text-sm text-red-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF7A00] hover:bg-[#E86A00] text-white rounded-lg py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Rejestrowanie..." : "Zarejestruj się"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Masz już konto? <Link href="/login" className="text-blue-600 hover:underline">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;


