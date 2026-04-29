import React, { useState, useEffect, useRef } from 'react';

interface ModaleNomeCampoProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nome: string) => void;
  initialValue?: string;
  error?: string | null;
}

export const ModaleNomeCampo: React.FC<ModaleNomeCampoProps> = ({ isOpen, onClose, onSubmit, initialValue = '', error }) => {
  const [nome, setNome] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNome(initialValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onSubmit(nome.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] w-full max-w-md p-6 border border-[#333] shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-tight">Nuovo Campo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
              Nome del campo (univoco)
            </label>
            <input
              ref={inputRef}
              type="text"
              value={nome}
              onChange={(e) => {
                const val = e.target.value.replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_]/gu, '');
                setNome(val);
              }}
              className="w-full bg-[#2D2D2D] border border-[#444] rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              placeholder="es. ragione_sociale"
            />
            {error && (
              <p className="mt-2 text-[10px] text-red-400 uppercase tracking-widest">{error}</p>
            )}
            <p className="mt-2 text-[10px] text-gray-500">
              Usa solo lettere (anche accentate), numeri e underscore. Gli spazi verranno convertiti.
            </p>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 border-t border-[#333] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={!nome.trim()}
              className="px-4 py-1.5 text-xs font-bold bg-[#C0272D] text-white rounded hover:bg-[#D0373D] transition-colors disabled:opacity-50"
            >
              Conferma
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
