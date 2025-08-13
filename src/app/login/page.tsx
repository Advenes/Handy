"use client";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Błąd logowania");
      setMessage("Zalogowano pomyślnie");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Błąd logowania");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold text-center mb-1">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">Zaloguj się do swojego konta</p>

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

          {message && <p className="text-center text-sm text-red-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
          className="w-full bg-[#FF7A00] hover:bg-[#E86A00] text-white rounded-lg py-2 font-medium disabled:opacity-60"
            aria-label="Zaloguj się"
          >
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Nie masz konta? <Link href="/register" className="text-blue-600 hover:underline">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


