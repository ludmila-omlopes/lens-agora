import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const { address, contractAddress, contractType } = await request.json();
    if (!address || !contractAddress || !contractType) {
      return NextResponse.json({ message: 'Error' }, { status: 400 });
    }
    try {
      await sql`
        INSERT INTO contracts_deployed_by_address (address, contract_address, contract_type)
        VALUES (${address}, ${contractAddress}, ${contractType})
      `;
      return NextResponse.json({ message: 'Contract submitted successfully' }, { status: 200 });
    } catch (error) {
      console.error("Error inserting deployed contract:", error);
      return NextResponse.json({ error: 'Error inserting deployed contract' }, { status: 500 });
    }
}




  