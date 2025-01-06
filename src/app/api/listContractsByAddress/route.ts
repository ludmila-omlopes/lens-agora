import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { message: "Address is required" },
      { status: 400 }
    );
  }

  try {
    const { rows } = await sql`
      SELECT address, contract_address, contract_type, created_at
      FROM contracts_deployed_by_address
      WHERE address = ${address}
    `;

    return NextResponse.json({ contracts: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching deployed contracts:", error);
    return NextResponse.json(
      { error: "Error fetching deployed contracts" },
      { status: 500 }
    );
  }
}