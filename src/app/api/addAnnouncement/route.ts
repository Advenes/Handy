import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("requests");
    const announcements = db.collection("announcements");

    const newAnnouncement = await request.json();

    const result = await announcements.insertOne(newAnnouncement);

    return NextResponse.json(
      { message: "Ogłoszenie dodane", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Coś poszło nie tak", error: (error as Error).message },
      { status: 500 }
    );
  }
}
