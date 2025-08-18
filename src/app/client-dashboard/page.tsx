"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../components/AuthGuard";

type JobStatus = "pending" | "in-progress" | "completed" | "cancelled";
type JobPriority = "low" | "medium" | "high";

interface JobRequest {
  id: string;
  title: string;
  description: string;
  priority: JobPriority;
  estimatedTime: string;
  estimatedPrice: number;
  status: JobStatus;
  category: string;
  createdAt: string;
  providerName?: string;
  providerRating?: number;
  scheduledDate?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  voivodeship: string;
  role: "client";
  totalSpent: number;
  completedJobs: number;
  activeJobs: number;
}

const ClientDashboardPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();

  const handleLogout = () => {
    // Usuń dane użytkownika z localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    
    // Przekieruj na stronę główną
    router.push("/");
  };



  useEffect(() => {
    // Symulacja pobierania profilu klienta
    setUserProfile({
      name: "Anna Nowak",
      email: "anna.nowak@example.com",
      phone: "987654321",
      voivodeship: "wielkopolskie",
      role: "client",
      totalSpent: 1240,
      completedJobs: 8,
      activeJobs: 2
    });

    // Symulacja zleceń klienta
    setJobRequests([
      {
        id: "1",
        title: "Naprawa kranu w łazience",
        description: "Kran w umywalce łazienkowej przecieka od kilku dni. Potrzebna pilna naprawa.",
        priority: "high",
        estimatedTime: "1.5h",
        estimatedPrice: 85,
        status: "in-progress",
        category: "plumbing",
        createdAt: "2024-01-15",
        providerName: "Jan Kowalski",
        providerRating: 4.8,
        scheduledDate: "2024-01-16"
      },
      {
        id: "2",
        title: "Montaż wentylatora sufitowego",
        description: "Potrzebuję zamontować nowy wentylator sufitowy w głównej sypialni.",
        priority: "medium",
        estimatedTime: "2h",
        estimatedPrice: 120,
        status: "pending",
        category: "electrical",
        createdAt: "2024-01-14"
      },
      {
        id: "3",
        title: "Głębokie czyszczenie mieszkania",
        description: "Potrzebuję dokładnego czyszczenia całego mieszkania. Mieszkanie 2-pokojowe, 45m².",
        priority: "low",
        estimatedTime: "4h",
        estimatedPrice: 150,
        status: "completed",
        category: "cleaning",
        createdAt: "2024-01-10",
        providerName: "Maria Wiśniewska",
        providerRating: 4.9
      }
    ]);
  }, []);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "in-progress": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: JobStatus) => {
    switch (status) {
      case "pending": return "Oczekujące";
      case "in-progress": return "W trakcie";
      case "completed": return "Zakończone";
      case "cancelled": return "Anulowane";
      default: return "Nieznany";
    }
  };

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

  const filteredJobs = jobRequests.filter(job => {
    if (selectedStatus !== "all" && job.status !== selectedStatus) return false;
    if (selectedCategory !== "all" && job.category !== selectedCategory) return false;
    return true;
  });

  const stats = {
    totalSpent: jobRequests.reduce((sum, job) => job.status === "completed" ? sum + job.estimatedPrice : sum, 0),
    activeJobs: jobRequests.filter(job => job.status === "in-progress" || job.status === "pending").length,
    completedJobs: jobRequests.filter(job => job.status === "completed").length
  };

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
    <AuthGuard requiredRole="client">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Panel klienta</h1>
                <p className="text-gray-600 mt-1">Witaj, {userProfile.name}!</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/addRequest"
                  className="px-4 py-2 bg-[#FF7A00] hover:bg-[#E86A00] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Nowe zlecenie
                </Link>
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
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aktywne zlecenia</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                </div>
                <div className="text-2xl">📋</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Zakończone</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Wydane łącznie</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSpent} zł</p>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="pending">Oczekujące</option>
              <option value="in-progress">W trakcie</option>
              <option value="completed">Zakończone</option>
              <option value="cancelled">Anulowane</option>
            </select>

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
          </div>

          {/* Job Requests List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex gap-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(job.priority)}`}>
                            {getPriorityText(job.priority)}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(job.status)}`}>
                            {getStatusText(job.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <span>⏱️ {job.estimatedTime}</span>
                      <span>💰 {job.estimatedPrice} zł</span>
                      <span>📅 {new Date(job.createdAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                    
                    {job.providerName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <span className="font-medium">Fachowiec: {job.providerName}</span>
                        {job.providerRating && (
                          <span className="flex items-center gap-1">
                            ⭐ {job.providerRating}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {job.scheduledDate && (
                      <div className="text-sm text-gray-600">
                        📅 Zaplanowane na: {new Date(job.scheduledDate).toLocaleDateString('pl-PL')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Zobacz szczegóły
                    </button>
                    {job.status === "pending" && (
                      <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                        Anuluj
                      </button>
                    )}
                    {job.status === "completed" && (
                      <button className="px-4 py-2 bg-[#FF7A00] hover:bg-[#E86A00] text-white rounded-lg text-sm font-medium transition-colors">
                        Oceń
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Brak zleceń</h3>
              <p className="text-gray-600">Nie masz jeszcze żadnych zleceń lub nie pasują do wybranych filtrów</p>
              <Link 
                href="/addRequest"
                className="inline-block mt-4 px-6 py-2 bg-[#FF7A00] hover:bg-[#E86A00] text-white rounded-lg font-medium transition-colors"
              >
                Utwórz pierwsze zlecenie
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 shadow-lg mt-8">
          <div className="px-6">
            <div className="flex justify-around py-3">
              <Link href="/addRequest" className="flex flex-col items-center text-gray-400">
                <span className="text-xl">➕</span>
                <span className="text-xs font-medium">Zlecenie</span>
              </Link>
              <Link href="/client-dashboard" className="flex flex-col items-center text-[#FF7A00]">
                <span className="text-xl">👤</span>
                <span className="text-xs font-medium">Klient</span>
              </Link>
              <Link href="/wyszukaj" className="flex flex-col items-center text-gray-400">
                <span className="text-xl">🔍</span>
                <span className="text-xs font-medium">Wyszukaj</span>
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

export default ClientDashboardPage;
