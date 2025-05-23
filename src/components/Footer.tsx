import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12 py-8 text-gray-700">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-start md:items-center">
        {/* Contato */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Contato</h3>
          <p>
            WhatsApp: <a href="https://wa.me/5588999999999" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">(88) 99999-9999</a>
          </p>
          <p>
            Email: <a href="mailto:ca.exemplo@ufc.br" className="text-blue-700 hover:underline">ca.exemplo@ufc.br</a>
          </p>
        </div>

        {/* Localização */}
        <div className="space-y-2 max-w-xs">
          <h3 className="font-bold text-lg">Localização</h3>
          <p>Av. da Universidade, 2853 - Benfica, Fortaleza - CE, 60020-181</p>
          <div className="rounded overflow-hidden border shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15924.96407396413!2d-38.543265!3d-3.742847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74859e2e2b2e1%3A0x2e6b7e2e2b2e2e2e!2sUniversidade%20Federal%20do%20Cear%C3%A1!5e0!3m2!1spt-BR!2sbr!4v1684188888888!5m2!1spt-BR!2sbr"
              width="250"
              height="120"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa UFC"
            ></iframe>
          </div>
        </div>

        {/* Horários e Informações */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Horário: segunda-sexta</h3>
          <p>De 8:00 - 17:30 (exceto feriados)</p>
          <h3 className="font-bold text-lg mt-4">Mais Informações</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/sobre/contato" className="hover:underline text-blue-700">Fale Conosco</Link>
            </li>
            <li>
              <Link href="/calouros/guia" className="hover:underline text-blue-700">Guia do Calouro</Link>
            </li>
            <li>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:underline text-pink-700">Instagram</a>
            </li>
            <li>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-800">Facebook</a>
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