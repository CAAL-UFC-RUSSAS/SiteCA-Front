import { NextResponse } from "next/server";
import { produtos } from "@/data/produtos";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const produto = produtos.find(p => p.id === Number(id));
  if (!produto) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  return NextResponse.json(produto);
} 