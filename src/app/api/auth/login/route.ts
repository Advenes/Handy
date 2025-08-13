import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, phone, password } = await request.json();
    
    // Sprawdzenie czy podano hasło
    if (!password) {
      return NextResponse.json({ message: "Hasło jest wymagane" }, { status: 400 });
    }

    // Sprawdzenie czy podano email lub telefon
    if (!email && !phone) {
      return NextResponse.json({ message: "Email lub numer telefonu jest wymagany" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("users");
    const users = db.collection("users");

    // Wyszukiwanie użytkownika po email lub telefon
    let user;
    if (email) {
      user = await users.findOne({ email });
    } else {
      user = await users.findOne({ phone });
    }

    if (!user) {
      return NextResponse.json({ message: "Nieprawidłowy email/telefon lub hasło" }, { status: 401 });
    }

    // Sprawdzenie hasła
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ message: "Nieprawidłowy email/telefon lub hasło" }, { status: 401 });
    }

    // Zwracanie danych użytkownika (bez hasła)
    const { passwordHash, ...userData } = user;
    return NextResponse.json({ 
      message: "Zalogowano pomyślnie", 
      user: userData 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Błąd serwera", error: (error as Error).message }, { status: 500 });
  }
}


