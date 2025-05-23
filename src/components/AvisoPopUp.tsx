import { useState } from "react";
import { X } from "lucide-react";

interface Aviso {
  mensagem: string;
  data: string;
}

interface AvisoPopUpProps {
  avisos: Aviso[];
}

export default function AvisoPopUp({ avisos }: AvisoPopUpProps) {
  const [aberto, setAberto] = useState(true);

  if (!aberto || avisos.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[100] bg-yellow-50 border border-yellow-300 shadow-lg rounded-lg px-4 py-3 flex items-start gap-3 max-w-xs animate-in fade-in slide-in-from-top-5">
      <div className="flex-1 text-sm text-yellow-900">
        <strong className="block font-semibold mb-1 text-black">Avisos Importantes</strong>
        <ul className="list-disc pl-5 space-y-1">
          {avisos.map((aviso, idx) => (
            <li key={idx} className="flex flex-col">
              <span>{aviso.mensagem}</span>
              <span className="inline-block text-xs font-semibold bg-blue-100 text-yellow-800 mt-1 px-2 py-0.5 rounded-full shadow-sm w-fit">
                {aviso.data}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => setAberto(false)}
        className="ml-2 text-yellow-700 hover:text-white hover:bg-yellow-600 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        aria-label="Fechar aviso"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
} 