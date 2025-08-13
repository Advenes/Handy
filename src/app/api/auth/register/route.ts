import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { emailOrPhone, password, role, ...rest } = await request.json();
    if (!emailOrPhone || !password) {
      return NextResponse.json({ message: "Brak wymaganych pól" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("users");
    const users = db.collection("users");

    const existing = await users.findOne({ emailOrPhone });
    if (existing) {
      return NextResponse.json({ message: "Użytkownik już istnieje" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const doc = {
      emailOrPhone,
      passwordHash,
      role: role || "client",
      profile: rest || {},
      createdAt: new Date(),
    };

    const result = await users.insertOne(doc);
    return NextResponse.json({ message: "Konto utworzone", id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Błąd serwera", error: (error as Error).message }, { status: 500 });
  }
}


