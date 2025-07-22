'use client';

import { HomeBanner } from "@/components/HomeBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import { Store, School } from "lucide-react";
import EventosSidebar from "@/components/EventosSidebar";

export default function Home() {
  return (
    <>
      {/* Sidebar fixa de eventos */}
      <EventosSidebar />
      
      {/* Banner Principal - Faixa branca que cobre toda a largura */}
      <div className="bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 p-10">
          <HomeBanner />
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Pop-up de Aviso Importante */}
        <div className="space-y-8">
          {/* Boas-vindas e resumo do CA */}
          <section className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-lg shadow p-6 lg:mt-10 max-w-7xl">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Seja bem-vindo ao nosso Centro Acadêmico!</h2>
              <p className="mb-2 text-gray-700">
              Somos o coração estudantil do curso de Ciência da Computação, um espaço feito por estudantes e para estudantes! Aqui a gente se organiza para lutar por melhorias no curso, promover eventos, oficinas, debates, ações culturais e, claro, fortalecer os laços da nossa comunidade acadêmica.
              </p>
              <p className="text-gray-700">
              Mais do que representar, queremos inspirar, conectar e transformar. Então se você tem uma ideia, um problema, ou só quer trocar uma ideia, chega junto! Nosso CA está sempre de portas abertas.
              <br/><strong> Juntos, fazemos mais do que código: fazemos história.</strong>
              </p>
              <div className="flex gap-4 mt-4">
                <a href="/pdf/EstatutoCA.pdf" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors">ESTATUTO CAOC</a>
                <a href="https://drive.google.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-colors">Drive do CAOC</a>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <Image src="/imgs/banner.png" alt="Centro Acadêmico" width={300} height={200} className="rounded-lg max-w-xs shadow" />
            </div>
          </section>

          {/* Serviços Rápidos */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Loja do CA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Camisetas do Curso</span>
                    <Badge variant="secondary">Novo</Badge>
                  </li>
                  <li className="flex justify-between">
                    <span>Materiais Didáticos</span>
                    <Badge variant="secondary">Em estoque</Badge>
                  </li>
                </ul>
                <Link href="/loja" className="text-sm text-blue-600 hover:underline block mt-4">
                  Visitar loja →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  Serviços Estudantis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Impressão</li>
                </ul>
                <Link href="/servicos" className="text-sm text-blue-600 hover:underline block mt-4">
                  Ver todos os serviços →
                </Link>
              </CardContent>
            </Card>
          </section>

          {/* Seção de Abas */}
          <Tabs defaultValue="documentos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="representacao">Representação</TabsTrigger>
            </TabsList>
            <TabsContent value="documentos">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos Importantes</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Link href="/documentos/requerimentos" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    Requerimentos
                  </Link>
                  <Link href="/documentos/manuais" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    Manual do Estudante
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="representacao">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Horário de Atendimento: Seg a Sex, 08h às 19h</p>
                    <Link href="/sobre/gestao" className="text-blue-600 hover:underline">
                      Conhecer a gestão →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Links Rápidos */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/calouros/guia" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-center">
              Guia do Calouro
            </Link>
            <Link href="/projetos/oportunidades" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-center">
              Oportunidades
            </Link>
            <Link href="/financeiro" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-center">
              Prestação de Contas
            </Link>
            <Link href="/contato" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 text-center">
              Fale Conosco
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
