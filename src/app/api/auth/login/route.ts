import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

interface UserDoc {
  emailOrPhone: string;
  passwordHash: string;
  role?: string;
  profile?: Record<string, unknown>;
  createdAt?: Date;
}

export async function POST(request: Request) {
  try {
    const { emailOrPhone, password } = await request.json();
    if (!emailOrPhone || !password) {
      return NextResponse.json({ message: "Brak wymaganych pól" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("users");
    const users = db.collection<UserDoc>("users");

    const user = await users.findOne({ emailOrPhone });
    if (!user) {
      return NextResponse.json({ message: "Nieprawidłowe dane logowania" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) {
      return NextResponse.json({ message: "Nieprawidłowe dane logowania" }, { status: 401 });
    }

    // Generowanie prostego tokenu sesyjnego (do rozbudowy: JWT + cookies HttpOnly)
    // Tu zwracamy sukces; frontend może zapisać token w pamięci/ciasteczku
    return NextResponse.json({ message: "Zalogowano" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Błąd serwera", error: (error as Error).message }, { status: 500 });
  }
}


