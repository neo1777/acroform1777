/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { PDFViewer } from './components/PDFViewer';
import { ModaleNomeCampo } from './components/ModaleNomeCampo';
import { useAppStore } from './store/useAppStore';
import { cn } from './lib/utils';

export default function App() {
  const { campi, addCampo, paginaCorrente, modalitaDisegno, pdfFile } = useAppStore();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [pendingRect, setPendingRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  const handleCampoDrawn = (rect: { x: number, y: number, width: number, height: number }) => {
    setPendingRect(rect);
    setModalError(null);
    setModalOpen(true);
  };

  const handleNameSubmit = (nome: string) => {
    if (campi.some(c => c.nome === nome)) {
      setModalError('Nome già usato — scegli un nome diverso');
      return;
    }
    
    if (pendingRect) {
      addCampo({
        nome,
        tipo: modalitaDisegno,
        pagina: paginaCorrente,
        x: pendingRect.x,
        y: pendingRect.y,
        width: pendingRect.width,
        height: pendingRect.height,
        fontSize: 10,
      });
    }
    
    setModalOpen(false);
    setPendingRect(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setPendingRect(null);
  };

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+0 for 100%, Ctrl++ for zoom in, Ctrl+- for zoom out
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '0' || e.key === 'NumPad0') {
          e.preventDefault();
          useAppStore.getState().setScala(1.0);
        } else if (e.key === '=' || e.key === '+' || e.key === 'Add') {
          e.preventDefault();
          useAppStore.getState().setScala(useAppStore.getState().scala + 0.25);
        } else if (e.key === '-' || e.key === 'Subtract') {
          e.preventDefault();
          useAppStore.getState().setScala(useAppStore.getState().scala - 0.25);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-[#1A1A1A] text-white font-sans overflow-hidden">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto relative flex flex-col bg-checkerboard">
          {pdfFile ? (
            <PDFViewer onCampoDrawn={handleCampoDrawn} />
          ) : (
            <div className="flex items-center justify-center flex-1 text-neutral-500 flex-col gap-4">
              <p className="text-xl">Nessun documento caricato</p>
              <p className="text-sm">Usa "Carica PDF" nella barra in alto per iniziare</p>
            </div>
          )}
        </div>
        <Sidebar />
      </div>

      <footer className="px-4 py-1.5 bg-[#1A1A1A] border-t border-neutral-800 flex justify-between items-center text-[10px] text-gray-500 shrink-0">
        <div className="flex items-center space-x-4">
          <span>Documento: <strong>{pdfFile ? pdfFile.name : 'Nessun PDF'}</strong></span>
          {pdfFile && <span>Dimensione: {(pdfFile.size / 1024 / 1024).toFixed(2)} MB</span>}
        </div>
        <div className="flex items-center space-x-4">
          <span>Acroform1777 | Sviluppato da <strong>Neo1777</strong> per <a href="https://www.sea-srl.it/panoramica-aziendale" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-neutral-600 underline-offset-2">S&A Stay Safe</a></span>
          <div className="flex items-center space-x-1">
            <div className={cn("w-1.5 h-1.5 rounded-full", pdfFile ? "bg-green-500" : "bg-neutral-600")}></div>
            <span>{pdfFile ? 'Pronto' : 'In attesa'}</span>
          </div>
          <span className="font-mono">v1.1.0</span>
        </div>
      </footer>
      
      <ModaleNomeCampo
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleNameSubmit}
        error={modalError}
      />
    </div>
  );
}

