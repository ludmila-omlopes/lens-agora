import { NextResponse } from "next/server";
import { checkDatabaseConnection, checkAllEnvironments } from "../../../../lib/database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkAll = searchParams.get("all") === 'true';

  try {
    if (checkAll) {
      // Check all environments
      const results = await checkAllEnvironments();
      
      return NextResponse.json({ 
        status: "multi-environment",
        environments: results,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    } else {
      // Check current environment (from headers or .env)
      const result = await checkDatabaseConnection(request.headers);
      
      if (result.success) {
        return NextResponse.json({ 
          status: "healthy", 
          database: "connected",
          environment: result.environment,
          timestamp: new Date().toISOString()
        }, { status: 200 });
      } else {
        return NextResponse.json({ 
          status: "unhealthy", 
          database: "disconnected",
          environment: result.environment,
          error: result.error,
          timestamp: new Date().toISOString()
        }, { status: 503 });
      }
    }
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ 
      status: "error", 
      database: "unknown",
      error: "Health check failed",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 