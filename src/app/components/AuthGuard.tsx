"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "client" | "provider" | "any";
}

const AuthGuard = ({ children, requiredRole = "any" }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Sprawdź czy użytkownik jest zalogowany (sprawdź localStorage lub cookies)
        const token = localStorage.getItem("authToken");
        const user = localStorage.getItem("userData");
        
        if (!token || !user) {
          setIsAuthenticated(false);
          setAuthError("not_authenticated");
          setIsLoading(false);
          return;
        }

        // Sprawdź czy token jest ważny (można dodać walidację z API)
        const userData = JSON.parse(user);
        setUserRole(userData.role);
        setIsAuthenticated(true);
        setAuthError(null);
        setIsLoading(false);
      } catch (error) {
        console.error("Błąd autoryzacji:", error);
        setIsAuthenticated(false);
        setAuthError("error");
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A00] mx-auto mb-4"></div>
          <p className="text-gray-600">Sprawdzanie autoryzacji...</p>
        </div>
      </div>
    );
  }

  // Render authentication error
  if (authError === "not_authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dostęp zabroniony</h1>
            <p className="text-gray-600">Musisz się zalogować, aby uzyskać dostęp do tej strony</p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full bg-[#FF7A00] hover:bg-[#E86A00] text-white rounded-lg py-3 font-medium text-center block transition-colors"
            >
              Zaloguj się
            </Link>
            <Link
              href="/register"
              className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-3 font-medium text-center block hover:bg-gray-50 transition-colors"
            >
              Zarejestruj się
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-[#FF7A00] hover:underline text-sm">
              ← Wróć do strony głównej
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render general error
  if (authError === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Błąd autoryzacji</h1>
            <p className="text-gray-600">Wystąpił błąd podczas sprawdzania autoryzacji</p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full bg-[#FF7A00] hover:bg-[#E86A00] text-white rounded-lg py-3 font-medium text-center block transition-colors"
            >
              Spróbuj ponownie
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-[#FF7A00] hover:underline text-sm">
              ← Wróć do strony głównej
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (requiredRole !== "any" && userRole !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Brak uprawnień</h1>
            <p className="text-gray-600">
              Ta strona jest dostępna tylko dla {requiredRole === "client" ? "klientów" : "fachowców"}
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="w-full bg-[#FF7A00] hover:bg-[#E86A00] text-white rounded-lg py-3 font-medium text-center block transition-colors"
            >
              Przejdź do dashboard
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-[#FF7A00] hover:underline text-sm">
              ← Wróć do strony głównej
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default AuthGuard;
