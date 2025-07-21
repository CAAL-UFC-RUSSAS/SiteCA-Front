import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12 py-8 text-gray-700">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-start md:items-center">
        {/* Contato */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Contato</h3>
          <p>
            Telefone: <a href="tel:+5574988757145" className="text-blue-700 hover:underline">(74) 988757145</a>
          </p>
          <p>
            Telefone: <a href="tel:+5511945165101" className="text-blue-700 hover:underline">(11) 94516-5101</a>
          </p>
          <p>
            Email: <a href="mailto:um.caal2.0@gmail.com" className="text-blue-700 hover:underline">um.caal2.0@gmail.com</a>
          </p>
        </div>

        {/* Localização */}
        <div className="space-y-2 max-w-xs">
          <h3 className="font-bold text-lg">Localização</h3>
          <p>R. Felipe Santiago, 411 - Cidade Universitária, Russas - CE, 62900-000</p>
          <div className="rounded overflow-hidden border shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8456785924!2d-37.977585!3d-4.933745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c0aa344d53b7c5%3A0x2e6b7e2e2b2e2e2e!2sR.%20Felipe%20Santiago%2C%20411%20-%20Cidade%20Universit%C3%A1ria%2C%20Russas%20-%20CE%2C%2062900-000%2C%20Brazil!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              width="250"
              height="120"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa UFC Russas"
            ></iframe>
          </div>
        </div>

        {/* Horários e Informações */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Horário: segunda-sexta</h3>
          <p>De 8:00 - 19:00 (exceto feriados)</p>
          <h3 className="font-bold text-lg mt-4">Mais Informações</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/contato" className="hover:underline text-blue-700">Fale Conosco</Link>
            </li>
            <li>
              <Link href="/calouros/guia" className="hover:underline text-blue-700">Guia do Calouro</Link>
            </li>
            <li>
              <a href="https://www.instagram.com/caalufc/" target="_blank" rel="noopener noreferrer" className="hover:underline text-pink-700">Instagram</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-8">
        © {new Date().getFullYear()} Centro Acadêmico. Todos os direitos reservados.
      </div>
    </footer>
  );
} 