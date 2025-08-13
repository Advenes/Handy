import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, phone, password, role, voivodeship, ...rest } = await request.json();
    
    // Walidacja wymaganych pól
    if (!email || !phone || !password || !voivodeship) {
      return NextResponse.json({ message: "Brak wymaganych pól" }, { status: 400 });
    }

    // Walidacja emaila
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Nieprawidłowy format emaila" }, { status: 400 });
    }

    // Walidacja numeru telefonu (9 cyfr)
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json({ message: "Nieprawidłowy format numeru telefonu" }, { status: 400 });
    }

    // Walidacja hasła (minimum 6 znaków)
    if (password.length < 6) {
      return NextResponse.json({ message: "Hasło musi mieć co najmniej 6 znaków" }, { status: 400 });
    }

    // Walidacja województwa
    const validVoivodeships = [
      "dolnoslaskie", "kujawsko-pomorskie", "lubelskie", "lubuskie", 
      "lodzkie", "malopolskie", "mazowieckie", "opolskie", "podkarpackie", 
      "podlaskie", "pomorskie", "slaskie", "swietokrzyskie", 
      "warminsko-mazurskie", "wielkopolskie", "zachodniopomorskie"
    ];
    if (!validVoivodeships.includes(voivodeship)) {
      return NextResponse.json({ message: "Nieprawidłowe województwo" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("users");
    const users = db.collection("users");

    // Sprawdzenie czy użytkownik już istnieje (email lub telefon)
    const existingByEmail = await users.findOne({ email });
    if (existingByEmail) {
      return NextResponse.json({ message: "Użytkownik z tym adresem email już istnieje" }, { status: 409 });
    }

    const existingByPhone = await users.findOne({ phone });
    if (existingByPhone) {
      return NextResponse.json({ message: "Użytkownik z tym numerem telefonu już istnieje" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const doc = {
      email,
      phone,
      passwordHash,
      role: role || "client",
      voivodeship,
      profile: rest || {},
      createdAt: new Date(),
    };

    const result = await users.insertOne(doc);
    return NextResponse.json({ message: "Konto utworzone", id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Błąd serwera", error: (error as Error).message }, { status: 500 });
  }
}


