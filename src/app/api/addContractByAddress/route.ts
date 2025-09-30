import { NextResponse } from "next/server";
import { addDeployedContract } from "../../../../lib/database";

export async function POST(request: Request) {
  const { address, contractAddress, contractType } = await request.json();
  
  if (!address || !contractAddress || !contractType) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }
  
  try {
    const result = await addDeployedContract(address, contractAddress, contractType, request.headers);
    
    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in addContractByAddress API:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




  