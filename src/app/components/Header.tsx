"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany
    const checkUserStatus = () => {
      try {
        const userData = localStorage.getItem("userData");
        const token = localStorage.getItem("authToken");
        
        if (userData && token) {
          const user = JSON.parse(userData);
          setUserRole(user.role);
          setUsername(user.username);
        } else {
          setUserRole(null);
          setUsername(null);
        }
      } catch (error) {
        console.error("Błąd podczas parsowania danych użytkownika:", error);
        setUserRole(null);
        setUsername(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();

    // Dodaj listener na zmiany w localStorage (opcjonalnie)
    const handleStorageChange = () => {
      checkUserStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDashboardClick = () => {
    if (!userRole) {
      router.push("/login");
      return;
    }

    // Przekieruj na odpowiedni panel
    if (userRole === "client") {
      router.push("/client-dashboard");
    } else if (userRole === "provider") {
      router.push("/provider-dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUserRole(null);
    setUsername(null);
    router.push("/");
  };

  // Sprawdź czy jesteśmy na stronie dashboard - po wszystkich hookach
  const isDashboardPage = pathname?.includes('dashboard');
  if (isDashboardPage) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between py-4 animate-fade-in">
        <Link href="/" className="text-4xl font-bold text-[#FF7A00] transition-base hover:opacity-90">
          Handy
        </Link>
        <nav className="flex gap-6 text-gray-600 items-center">
          <Link href="/addRequest" className="hover:text-[#FF7A00] transition py-2">
            Dodaj ogłoszenie
          </Link>
          <Link href="/wyszukaj" className="hover:text-[#FF7A00] transition py-2">
            Wyszukaj
          </Link>
          
          {/* Dashboard - zawsze widoczny */}
          <button
            onClick={handleDashboardClick}
            className="hover:text-[#FF7A00] transition py-2"
          >
            Dashboard
          </button>
          
          {isLoading ? (
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : userRole ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700">👤 {username}</span>
              <button
                onClick={handleLogout}
                className="bg-[#FF7A00] hover:bg-[#E86A00] text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Wyloguj się
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#FF7A00] hover:bg-[#E86A00] text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Zaloguj się
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
