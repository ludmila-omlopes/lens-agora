import { NextResponse } from "next/server";
import { getDeployedContractsByAddress } from "../../../../lib/database";

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
    const result = await getDeployedContractsByAddress(address, request.headers);
    
    if (result.success) {
      return NextResponse.json({ contracts: result.contracts }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in listContractsByAddress API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}