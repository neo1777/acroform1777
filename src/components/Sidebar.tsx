import React, { useState } from 'react';
import { useAppStore, TipoCampo, Campo } from '../store/useAppStore';
import { Trash2, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { ModaleNomeCampo } from './ModaleNomeCampo';

export const Sidebar: React.FC = () => {
  const { campi, campoSelezionato, setCampoSelezionato, removeCampo, updateCampo } = useAppStore();
  const [renamingCampo, setRenamingCampo] = useState<Campo | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);

  const handleManualCoordinateChange = (id: string, axis: 'x' | 'y' | 'width' | 'height', value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      updateCampo(id, { [axis]: num });
    }
  };

  const handleRenameSubmit = (novoNome: string) => {
    if (!renamingCampo) return;
    if (campi.some(c => c.nome === novoNome && c.id !== renamingCampo.id)) {
      setRenameError('Nome già usato — scegli un nome diverso');
      return;
    }
    updateCampo(renamingCampo.id, { nome: novoNome });
    setRenamingCampo(null);
    setRenameError(null);
  };

  const selectedCampoObj = campi.find(c => c.id === campoSelezionato);

  return (
    <aside className="w-72 bg-[#2D2D2D] border-l border-neutral-800 flex flex-col p-4 shrink-0 overflow-hidden h-full">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Campi Documento</h3>
        <span className="text-[10px] bg-[#1A1A1A] px-2 py-0.5 rounded text-gray-500">{campi.length} Totali</span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto mb-4">
        {campi.map((campo) => {
          const isDato = campo.tipo === 'dato';
          const isSelected = campo.id === campoSelezionato;

          return (
            <div
              key={campo.id}
              onClick={() => setCampoSelezionato(campo.id)}
              className={cn(
                "p-3 rounded flex items-center justify-between group cursor-pointer transition-colors border-l-2",
                isSelected ? "bg-[#1A1A1A]" : "bg-[#333] border-transparent hover:bg-neutral-700",
                isDato && isSelected ? "border-blue-500" : "",
                !isDato && isSelected ? "border-green-500" : ""
              )}
            >
              <div>
                <div className={cn("text-[11px] font-mono", isDato ? "text-blue-400" : "text-green-400")}>
                  {campo.nome}
                </div>
                <div className="text-[9px] text-gray-500 uppercase mt-0.5">
                  {isDato ? "Dato S&A" : "Campo Cliente"}
                </div>
              </div>
              <div className={cn("flex space-x-1", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingCampo(campo);
                  }}
                  className="p-1 text-gray-500 hover:text-white"
                  title="Modifica nome"
                >
                  ✎
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCampo(campo.id);
                  }}
                  className="p-1 text-gray-500 hover:text-red-500"
                  title="Elimina"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
        {campi.length === 0 && (
          <div className="text-center text-sm text-neutral-500 py-8">
            Nessun campo aggiunto.
            <br />
            Disegna sul PDF per iniziare.
          </div>
        )}
      </div>

      {selectedCampoObj && (
        <div className="border-t border-[#444] pt-4 mt-auto flex-shrink-0">
          <h4 className="text-[10px] uppercase text-gray-500 font-bold mb-3">Coordinate (pt)</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[9px] text-gray-500 block mb-1">Posizione X</label>
              <input
                type="number"
                step="0.1"
                value={selectedCampoObj.x.toFixed(1)}
                onChange={(e) => handleManualCoordinateChange(selectedCampoObj.id, 'x', e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#444] text-[11px] font-mono px-2 py-1 rounded text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 block mb-1">Posizione Y (bottom)</label>
              <input
                type="number"
                step="0.1"
                value={selectedCampoObj.y.toFixed(1)}
                onChange={(e) => handleManualCoordinateChange(selectedCampoObj.id, 'y', e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#444] text-[11px] font-mono px-2 py-1 rounded text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 block mb-1">Larghezza</label>
              <input
                type="number"
                step="0.1"
                value={selectedCampoObj.width.toFixed(1)}
                onChange={(e) => handleManualCoordinateChange(selectedCampoObj.id, 'width', e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#444] text-[11px] font-mono px-2 py-1 rounded text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 block mb-1">Altezza</label>
              <input
                type="number"
                step="0.1"
                value={selectedCampoObj.height.toFixed(1)}
                onChange={(e) => handleManualCoordinateChange(selectedCampoObj.id, 'height', e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#444] text-[11px] font-mono px-2 py-1 rounded text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <h4 className="text-[10px] uppercase text-gray-500 font-bold mb-3 mt-4 border-t border-[#444] pt-4">Formato / Maschera</h4>
          <div>
            <input
              type="text"
              placeholder="es. gg/mm/aaaa, € #.##0,00"
              value={selectedCampoObj.formato || ''}
              onChange={(e) => updateCampo(selectedCampoObj.id, { formato: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#444] text-[11px] font-mono px-2 py-2 rounded text-white outline-none focus:border-blue-500"
            />
            <p className="text-[9px] text-gray-500 mt-1 italic">Maschera per validazione o calcolo (es: ##/##/####)</p>
          </div>
        </div>
      )}

      {renamingCampo && (
        <ModaleNomeCampo
          isOpen={true}
          onClose={() => { setRenamingCampo(null); setRenameError(null); }}
          onSubmit={handleRenameSubmit}
          initialValue={renamingCampo.nome}
          error={renameError}
        />
      )}
    </aside>
  );
};

