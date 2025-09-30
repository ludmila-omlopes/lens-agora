import { NextResponse } from "next/server";
import { addWaitlistEntry } from "../../../../lib/database";

export async function POST(request: Request) {
  const { lens_username, email, wallet_address } = await request.json();
  
  if (!lens_username || !email || !wallet_address) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }
  
  try {
    const result = await addWaitlistEntry(lens_username, email, wallet_address, request.headers);
    
    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in addWaitlist API:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




  