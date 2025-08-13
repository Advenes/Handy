"use client";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
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

    if (loginMethod === "email") {
      if (!email || !validateEmail(email)) {
        newErrors.email = "Wprowadź poprawny adres email";
      }
    } else {
      if (!phone || !validatePhone(phone)) {
        newErrors.phone = "Wprowadź poprawny numer telefonu (9 cyfr)";
      }
    }

    if (!password || password.length < 6) {
      newErrors.password = "Hasło musi mieć co najmniej 6 znaków";
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
      const loginData = loginMethod === "email" 
        ? { email, password }
        : { phone, password };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
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

        <div className="grid grid-cols-2 gap-2 mb-6" role="tablist" aria-label="Wybierz metodę logowania">
          <button
            type="button"
            onClick={() => setLoginMethod("email")}
            className={`px-4 py-2 rounded-lg border text-sm ${loginMethod === "email" ? "bg-[#FF7A00] text-white border-[#FF7A00]" : "bg-gray-100 text-gray-700 border-transparent"}`}
            aria-selected={loginMethod === "email"}
            role="tab"
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("phone")}
            className={`px-4 py-2 rounded-lg border text-sm ${loginMethod === "phone" ? "bg-[#FF7A00] text-white border-[#FF7A00]" : "bg-gray-100 text-gray-700 border-transparent"}`}
            aria-selected={loginMethod === "phone"}
            role="tab"
          >
            Telefon
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMethod === "email" ? (
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
          ) : (
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
          )}

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


