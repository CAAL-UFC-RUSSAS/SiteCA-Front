import { NextResponse } from "next/server";
import { produtos } from "@/data/produtos";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const produto = produtos.find(p => p.id === Number(params.id));
  if (!produto) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  return NextResponse.json(produto);
} 