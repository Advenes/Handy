"use client";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { GoogleMap, Marker } from "@react-google-maps/api";

type Item = {
  _id: string;
  title: string;
  category?: string;
  urgency?: string;
  money?: number | null;
  latitude: number;
  longitude: number;
  location?: string;
};

const inter = Inter({ subsets: ["latin"] });

export default function SearchPage() {
  const [category, setCategory] = useState<string>("");
  const [urgency, setUrgency] = useState<string>("");
  const [minMoney, setMinMoney] = useState<string>("");
  const [maxMoney, setMaxMoney] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);

  const [center] = useState({ lat: 52.2297, lng: 21.0122 });
  const [zoom] = useState(11);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  

  const fetchItems = async (bounds?: google.maps.LatLngBounds | null) => {
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (urgency) params.set("urgency", urgency);
      if (minMoney) params.set("minMoney", minMoney);
      if (maxMoney) params.set("maxMoney", maxMoney);
      if (bounds) {
        const south = bounds.getSouthWest().lat();
        const west = bounds.getSouthWest().lng();
        const north = bounds.getNorthEast().lat();
        const east = bounds.getNorthEast().lng();
        params.set("bounds", `${south},${west},${north},${east}`);
      }

      const res = await fetch(`/api/announcements?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Błąd pobierania ogłoszeń");
      const cleaned: Item[] = (data.items || [])
        .map((r: Partial<Item> & { _id?: unknown; latitude?: unknown; longitude?: unknown; money?: unknown }) => {
          const lat = Number(r?.latitude);
          const lng = Number(r?.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          return {
            _id: String(r._id ?? ""),
            title: String(r.title ?? "Bez tytułu"),
            category: r.category,
            urgency: r.urgency,
            money: typeof r.money === "number" ? r.money : r.money == null ? null : Number(r.money),
            latitude: lat,
            longitude: lng,
            location: r.location,
          } as Item;
        })
        .filter(Boolean);
      setItems(cleaned);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={`${inter.className}`}> 
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 animate-fade-in">Wyszukaj ogłoszenia</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white border rounded-xl p-4 md:p-6 shadow-sm animate-slide-up">
        <div className="space-y-2">
          <label className="block text-sm">Kategoria</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-2 py-2">
            <option value="">Wszystkie</option>
            <option value="Sprzątanie">Sprzątanie</option>
            <option value="Naprawa">Naprawa</option>
            <option value="Budowa">Budowa</option>
            <option value="Ogrodnictwo">Ogrodnictwo</option>
            <option value="Inne">Inne</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Pilność</label>
          <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="w-full border rounded px-2 py-2">
            <option value="">Wszystkie</option>
            <option value="low">Niska</option>
            <option value="medium">Średnia</option>
            <option value="high">Wysoka</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Kwota od</label>
          <input type="number" value={minMoney} onChange={(e) => setMinMoney(e.target.value)} className="w-full border rounded px-2 py-2" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Kwota do</label>
          <input type="number" value={maxMoney} onChange={(e) => setMaxMoney(e.target.value)} className="w-full border rounded px-2 py-2" />
        </div>
        <div className="md:col-span-4 flex gap-2">
          <button onClick={() => fetchItems()} className="bg-[#FF7A00] text-white px-5 py-2.5 rounded-lg hover:bg-[#E86A00] transition">Szukaj</button>
          <button onClick={() => { setCategory(""); setUrgency(""); setMinMoney(""); setMaxMoney(""); fetchItems(); }} className="border px-5 py-2.5 rounded-lg hover:bg-gray-50 transition">Wyczyść</button>
        </div>
      </div>

      <div className="w-full h-[75vh] rounded-2xl overflow-hidden border shadow-sm bg-white animate-slide-up" style={{ animationDelay: "90ms" }}>
        <GoogleMap
          onLoad={(map) => {
            setMapInstance(map);
            // opcjonalnie dopasuj mapę do wyników
            if (items.length) {
              const bounds = new google.maps.LatLngBounds();
              items.forEach((it) => bounds.extend({ lat: it.latitude, lng: it.longitude }));
              map.fitBounds(bounds);
            }
          }}
          onDragEnd={() => {
            const b = mapInstance?.getBounds();
            if (b) fetchItems(b);
          }}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={zoom}
        >
          {items.map((it) => (
            <Marker
              key={it._id}
              position={{ lat: it.latitude, lng: it.longitude }}
              title={it.title}
            />
          ))}
        </GoogleMap>
      </div>
    </main>
  );
}


