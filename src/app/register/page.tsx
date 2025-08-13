"use client";
import Link from "next/link";
import { useState } from "react";

type Role = "client" | "provider";

const RegisterPage = () => {
  const [role, setRole] = useState<Role>("client");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [nip, setNip] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [businessStartDate, setBusinessStartDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload: any = { emailOrPhone, password, role };
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
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <label className="block text-sm font-medium mb-1">Email lub numer telefonu</label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {role === "provider" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Numer NIP</label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nazwa firmy</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adres</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data rozpoczęcia działalności gospodarczej</label>
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


