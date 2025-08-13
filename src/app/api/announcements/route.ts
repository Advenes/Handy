import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

type AnnouncementDoc = {
  _id: unknown;
  title?: string;
  category?: string;
  urgency?: string;
  money?: number | null;
  latitude?: number;
  longitude?: number;
  location?: string;
};
type AnnouncementWithCoords = Omit<AnnouncementDoc, "latitude" | "longitude"> & {
  latitude: number;
  longitude: number;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sp = url.searchParams;

    const category = sp.get("category") || undefined;
    const urgency = sp.get("urgency") || undefined;
    const minMoney = sp.get("minMoney");
    const maxMoney = sp.get("maxMoney");
    const bounds = sp.get("bounds"); // optional: "south,west,north,east"

    const client = await clientPromise;
    const db = client.db("requests");
    const announcements = db.collection("announcements");

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;

    if (minMoney || maxMoney) {
      const moneyFilter: { $gte?: number; $lte?: number } = {};
      if (minMoney) moneyFilter.$gte = Number(minMoney);
      if (maxMoney) moneyFilter.$lte = Number(maxMoney);
      filter.money = moneyFilter;
    }

    if (bounds) {
      const parts = bounds.split(",").map((p) => Number(p.trim()));
      if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
        const [south, west, north, east] = parts;
        filter.latitude = { $gte: south, $lte: north };
        if (west <= east) {
          filter.longitude = { $gte: west, $lte: east };
        } else {
          // date line wrap-around: west>east
          filter.$or = [
            { longitude: { $gte: west, $lte: 180 } },
            { longitude: { $gte: -180, $lte: east } },
          ];
        }
      }
    }

    const projection = {
      title: 1,
      category: 1,
      urgency: 1,
      money: 1,
      latitude: 1,
      longitude: 1,
      location: 1,
    } as const;

    const results = await announcements
      .find<AnnouncementDoc>(filter, { projection })
      .limit(500)
      .toArray();
    const cleaned: AnnouncementWithCoords[] = results.filter(
      (r): r is AnnouncementWithCoords =>
        Number.isFinite(r?.latitude) && Number.isFinite(r?.longitude)
    );
    return NextResponse.json({ items: cleaned }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Błąd serwera", error: (error as Error).message }, { status: 500 });
  }
}


