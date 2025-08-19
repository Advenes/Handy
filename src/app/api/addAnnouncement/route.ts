import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

async function geocodeAddress(fullAddress: string): Promise<{ lat: number; lng: number } | null> {
	try {
		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
		if (!apiKey) return null;
		const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
		url.searchParams.set("address", fullAddress);
		url.searchParams.set("key", apiKey);

		const res = await fetch(url.toString());
		if (!res.ok) return null;
		const data = await res.json();
		const result = data?.results?.[0];
		if (!result) return null;
		const location = result.geometry?.location;
		if (!location) return null;
		return { lat: location.lat, lng: location.lng };
	} catch {
		return null;
	}
}

export async function POST(request: Request) {
	try {
		const client = await clientPromise;
		const db = client.db("requests");
		const announcements = db.collection("announcements");
		const counters = db.collection("counters");

		const body = await request.json();
		const {
			category,
			title,
			description,
			urgency,
			money,
			addressLine1,
			city,
			postalCode,
			country,
			userId,
			username,
			contactEmail,
			clientRequirements,
			clientAvailability, // e.g. "always" | "weekends" | "saturday" | { dates: string[] }
			attachments, // array of objects with preview/name (no backend storage yet)
		} = body;

		// wymagane pola ogłoszenia
		if (!category || !title || !description || !urgency || !addressLine1 || !city || !postalCode || !country) {
			return NextResponse.json({ message: "Brak wymaganych pól" }, { status: 400 });
		}

		// wymagane pola autoryzacji / właściciela ogłoszenia
		if (!userId || !username || !contactEmail) {
			return NextResponse.json({ message: "Musisz być zalogowany, aby dodać ogłoszenie" }, { status: 401 });
		}

		const fullAddress = `${addressLine1}, ${postalCode} ${city}, ${country}`;
		const coords = await geocodeAddress(fullAddress);
		if (!coords) {
			return NextResponse.json({ message: "Nie udało się zgeokodować adresu" }, { status: 400 });
		}

		// Atomowa inkrementacja licznika, aby uzyskać numericzne ID (od 0 wzwyż)
		const counterDoc = await counters.findOneAndUpdate(
			{ _id: "announcements" },
			{ $inc: { seq: 1 } },
			{ upsert: true, returnDocument: "after" }
		);
		const numericId = Number(counterDoc?.value?.seq ?? 0);

		const newAnnouncement = {
			numericId,
			category,
			title,
			description,
			urgency,
			money: money ?? null,
			addressLine1,
			city,
			postalCode,
			country,
			location: fullAddress,
			latitude: coords.lat,
			longitude: coords.lng,
			// dodatkowe
			clientRequirements: clientRequirements ?? "",
			clientAvailability: clientAvailability ?? "always",
			attachments: Array.isArray(attachments) ? attachments : [],
			// właściciel
			posterId: userId,
			posterUsername: username,
			posterEmail: contactEmail,
			createdAt: new Date(),
		};

		const result = await announcements.insertOne(newAnnouncement);

		return NextResponse.json(
			{ message: "Ogłoszenie dodane", id: numericId },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Coś poszło nie tak", error: (error as Error).message },
			{ status: 500 }
		);
	}
}
