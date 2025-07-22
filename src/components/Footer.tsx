import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Clock, MapPin, Instagram, ExternalLink, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="relative h-12 w-12 mr-3">
                <Image 
                  src="/logoCAAL.svg" 
                  alt="Logo do Centro Acadêmico"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Centro Acadêmico</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Representando os estudantes de Ciência da Computação da UFC Campus Russas, 
              trabalhando para melhorar a experiência acadêmica e promover eventos.
            </p>
            <div className="pt-2">
              <a 
                href="https://www.instagram.com/caalufc/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white hover:shadow-lg transition-shadow"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/sobre" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <ChevronRight size={16} className="mr-2" />
                  <span>Sobre o CA</span>
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <ChevronRight size={16} className="mr-2" />
                  <span>Eventos</span>
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <ChevronRight size={16} className="mr-2" />
                  <span>Serviços</span>
                </Link>
              </li>
              <li>
                <Link href="/loja" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <ChevronRight size={16} className="mr-2" />
                  <span>Loja</span>
                </Link>
              </li>
              <li>
                <Link href="/financeiro/transparencia" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <ChevronRight size={16} className="mr-2" />
                  <span>Transparência</span>
                </Link>
              </li>
              <li>
                <Link href="/calouros/guia" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <ChevronRight size={16} className="mr-2" />
                  <span>Guia do Calouro</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone size={18} className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 font-medium">Telefones</p>
                  <a href="tel:+557488757145" className="text-gray-600 hover:text-blue-600 transition-colors block">(74) 98875-7145</a>
                  <a href="tel:+5511945165101" className="text-gray-600 hover:text-blue-600 transition-colors block">(11) 94516-5101</a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 font-medium">Email</p>
                  <a href="mailto:um.caal2.0@gmail.com" className="text-gray-600 hover:text-blue-600 transition-colors">um.caal2.0@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 font-medium">Horário de Funcionamento</p>
                  <p className="text-gray-600">Segunda a Sexta: 8:00 - 19:00</p>
                  <p className="text-gray-500 text-sm">(exceto feriados)</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Localização */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Localização</h3>
            <div className="flex items-start mb-3">
              <MapPin size={18} className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-gray-600">R. Felipe Santiago, 411 - Cidade Universitária, Russas - CE, 62900-000</p>
            </div>
            <div className="rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8456785924!2d-37.977585!3d-4.933745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c0aa344d53b7c5%3A0x2e6b7e2e2b2e2e2e!2sR.%20Felipe%20Santiago%2C%20411%20-%20Cidade%20Universit%C3%A1ria%2C%20Russas%20-%20CE%2C%2062900-000%2C%20Brazil!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa UFC Russas"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rodapé com Copyright e Créditos */}
      <div className="border-t border-gray-200 py-6 bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Centro Acadêmico de Ciência da Computação. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0">
            <Link href="/dev" className="text-sm text-gray-500 hover:text-blue-600 flex items-center transition-colors">
              <span>Desenvolvido por Antônio Lisboa</span>
              <ExternalLink size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 