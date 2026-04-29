import React from 'react';

interface ModaleDialogoProps {
  isOpen: boolean;
  titolo: string;
  messaggio: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ModaleDialogo: React.FC<ModaleDialogoProps> = ({ 
  isOpen, 
  titolo, 
  messaggio, 
  onConfirm, 
  onCancel,
  confirmText = 'Conferma',
  cancelText = 'Annulla'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] w-full max-w-sm p-6 border border-[#333] shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">{titolo}</h2>
        <p className="text-sm text-gray-400 mb-6 whitespace-pre-wrap">{messaggio}</p>
        
        <div className="flex justify-end gap-3 mt-4 border-t border-[#333] pt-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs font-bold bg-[#C0272D] text-white rounded hover:bg-[#D0373D] transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
