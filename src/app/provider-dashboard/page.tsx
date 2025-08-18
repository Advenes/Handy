"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "../components/AuthGuard";

type JobPriority = "low" | "medium" | "high";

interface Job {
  id: string;
  title: string;
  description: string;
  priority: JobPriority;
  estimatedTime: string;
  estimatedPrice: number;
  distance: string;
  clientName: string;
  clientRating: number;
  category: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  voivodeship: string;
  role: "provider";
  rating: number;
  completedJobs: number;
  totalEarnings: number;
}

const ProviderDashboardPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDistance, setSelectedDistance] = useState("all");
  const router = useRouter();

  const handleLogout = () => {
    // Usuń dane użytkownika z localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    
    // Przekieruj na stronę główną
    router.push("/");
  };



  useEffect(() => {
    // Symulacja pobierania profilu fachowca
    setUserProfile({
      name: "Jan Kowalski",
      email: "jan.kowalski@example.com",
      phone: "123456789",
      voivodeship: "wielkopolskie",
      role: "provider",
      rating: 4.8,
      completedJobs: 47,
      totalEarnings: 2840
    });

    // Symulacja dostępnych zadań
    setAvailableJobs([
      {
        id: "1",
        title: "Naprawa kranu w łazience",
        description: "Kran w umywalce łazienkowej przecieka od kilku dni. Potrzebna pilna naprawa.",
        priority: "high",
        estimatedTime: "1.5h",
        estimatedPrice: 85,
        distance: "2.3 km",
        clientName: "SJ Sarah Johnson",
        clientRating: 4.7,
        category: "plumbing"
      },
      {
        id: "2",
        title: "Montaż wentylatora sufitowego w sypialni",
        description: "Potrzebuję zamontować nowy wentylator sufitowy w głównej sypialni. Wentylator już kupiony.",
        priority: "medium",
        estimatedTime: "2h",
        estimatedPrice: 120,
        distance: "3.8 km",
        clientName: "MC Mike Chen",
        clientRating: 4.9,
        category: "electrical"
      },
      {
        id: "3",
        title: "Głębokie czyszczenie 2-pokojowego mieszkania",
        description: "Potrzebuję dokładnego czyszczenia całego mieszkania. Mieszkanie 2-pokojowe, 45m².",
        priority: "low",
        estimatedTime: "4h",
        estimatedPrice: 150,
        distance: "1.2 km",
        clientName: "AK Anna Kowalska",
        clientRating: 4.6,
        category: "cleaning"
      }
    ]);
  }, []);

  const getPriorityColor = (priority: JobPriority) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityText = (priority: JobPriority) => {
    switch (priority) {
      case "high": return "wysoki priorytet";
      case "medium": return "średni priorytet";
      case "low": return "niski priorytet";
      default: return "brak priorytetu";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "plumbing": return "🔧";
      case "electrical": return "⚡";
      case "cleaning": return "🧹";
      case "carpentry": return "🔨";
      case "painting": return "🎨";
      default: return "📋";
    }
  };

  const filteredJobs = availableJobs.filter(job => {
    if (selectedCategory !== "all" && job.category !== selectedCategory) return false;
    if (selectedDistance !== "all") {
      const distance = parseFloat(job.distance.replace(" km", ""));
      if (selectedDistance === "near" && distance > 5) return false;
      if (selectedDistance === "medium" && (distance <= 5 || distance > 15)) return false;
      if (selectedDistance === "far" && distance <= 15) return false;
    }
    return true;
  });

  const totalEarnings = filteredJobs.reduce((sum, job) => sum + job.estimatedPrice, 0);

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A00] mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="provider">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dostępne zadania</h1>
                <p className="text-gray-600 mt-1">
                  {filteredJobs.length} zadań w pobliżu • Potencjał zarobkowy: {totalEarnings} zł
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Main Page
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Wyloguj się
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Widok listy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
            >
              <option value="all">Wszystkie kategorie</option>
              <option value="plumbing">Hydraulika</option>
              <option value="electrical">Elektryka</option>
              <option value="cleaning">Sprzątanie</option>
              <option value="carpentry">Stolarstwo</option>
              <option value="painting">Malowanie</option>
            </select>

            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
            >
              <option value="all">Wszystkie odległości</option>
              <option value="near">Blisko (do 5 km)</option>
              <option value="medium">Średnio (5-15 km)</option>
              <option value="far">Daleko (powyżej 15 km)</option>
            </select>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-200 rounded-xl p-8 mb-6 text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Widok mapy wymaga integracji Mapbox
            </h3>
            <p className="text-gray-600 text-sm">
              Połącz z bazą danych, aby włączyć mapy i funkcje w czasie rzeczywistym
            </p>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(job.priority)}`}>
                          {getPriorityText(job.priority)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <span>⏱️ {job.estimatedTime}</span>
                      <span>💰 {job.estimatedPrice} zł szacowane</span>
                      <span>📍 {job.distance}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">{job.clientName}</span>
                      <span className="flex items-center gap-1">
                        ⭐ {job.clientRating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors">
                      Zobacz szczegóły
                    </button>
                    <button className="px-4 py-2 bg-[#E86A00] hover:bg-[#D65A00] text-white rounded-lg text-sm font-medium transition-colors">
                      Zgłoś się
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Brak dostępnych zadań</h3>
              <p className="text-gray-600">Spróbuj zmienić filtry lub sprawdź później</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 shadow-lg mt-8">
          <div className="px-6">
            <div className="flex justify-around py-3">
              <Link href="/wyszukaj" className="flex flex-col items-center text-gray-400">
                <span className="text-xl">🔍</span>
                <span className="text-xs font-medium">Wyszukaj</span>
              </Link>
              <Link href="/provider-dashboard" className="flex flex-col items-center text-[#FF7A00]">
                <span className="text-xl">🔧</span>
                <span className="text-xs font-medium">Fachowiec</span>
              </Link>
              <Link href="/chat" className="flex flex-col items-center text-gray-400">
                <span className="text-xl">💬</span>
                <span className="text-xs font-medium">Chat</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex flex-col items-center text-gray-400"
              >
                <span className="text-xl">🚪</span>
                <span className="text-xs font-medium">Wyloguj</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProviderDashboardPage;
