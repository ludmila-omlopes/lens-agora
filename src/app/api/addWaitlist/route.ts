import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const { lens_username, email, wallet_address } = await request.json();
    if (!lens_username && !email && !wallet_address) {
      return NextResponse.json({ message: 'Error' }, { status: 400 });
    }
    try {
      await sql`
        INSERT INTO lensagora_waitlist (lens_username, email, wallet_address, timestamp)
        VALUES (${lens_username}, ${email}, ${wallet_address}, NOW())
      `;
      return NextResponse.json({ message: 'Waitlist submitted successfully' }, { status: 200 });
    } catch (error) {
      console.error("Error inserting waitlist record: ", error);
      return NextResponse.json({ error: 'Error inserting waitlist record' }, { status: 500 });
    }
}




  