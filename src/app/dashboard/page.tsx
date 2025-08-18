"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../components/AuthGuard";

const DashboardPage = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        // Pobierz dane użytkownika z localStorage
        const userData = localStorage.getItem("userData");
        const token = localStorage.getItem("authToken");
        
        if (!userData || !token) {
          router.push("/login");
          return;
        }

        const user = JSON.parse(userData);
        setUserProfile(user);
        
        // Automatyczne przekierowanie na podstawie roli
        if (user.role === "client") {
          router.push("/client-dashboard");
        } else if (user.role === "provider") {
          router.push("/provider-dashboard");
        } else {
          // Nieznana rola - przekieruj na stronę główną
          router.push("/");
        }
      } catch (error) {
        console.error("Błąd podczas sprawdzania użytkownika:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndRedirect();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A00] mx-auto mb-4"></div>
          <p className="text-gray-600">Przekierowywanie na odpowiedni panel...</p>
        </div>
      </div>
    );
  }

  // Ta strona nie powinna być wyświetlana - użytkownik zostanie przekierowany
  return null;
};

export default DashboardPage;
