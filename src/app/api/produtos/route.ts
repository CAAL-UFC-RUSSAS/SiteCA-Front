import { NextResponse } from "next/server";
import { produtos } from "@/data/produtos";

export async function GET() {
  return NextResponse.json(produtos);
} 