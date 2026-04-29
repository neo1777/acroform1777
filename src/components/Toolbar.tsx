import React, { useRef, useState } from 'react';
import { useAppStore, TipoCampo } from '../store/useAppStore';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Upload, Grid } from 'lucide-react';
import { cn } from '../lib/utils';
import { generaAcroForm, downloadPdf } from '../lib/pdf-export';
import { ModaleDialogo } from './ModaleDialogo';
import logoBianco from '../assets/logo-bianco';

export const Toolbar: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogInfo, setDialogInfo] = useState<{ isOpen: boolean, titolo: string, messaggio: string, onConfirm: () => void, onCancel?: () => void, confirmText?: string, cancelText?: string }>({
    isOpen: false, titolo: '', messaggio: '', onConfirm: () => {}
  });

  const {
    pdfFile,
    pdfBytes,
    setPdf,
    pdfName,
    scala,
    setScala,
    paginaCorrente,
    totalePagine,
    setPaginaCorrente,
    modalitaDisegno,
    setModalitaDisegno,
    campi,
    snapGrid,
    setSnapGrid,
    gridSize,
    setGridSize,
    loadSession
  } = useAppStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const hasSession = await loadSession(file.name);
    
    if (hasSession) {
      setDialogInfo({
        isOpen: true,
        titolo: 'Sessione trovata',
        messaggio: 'Trovata una sessione precedente per questo file. Vuoi riprenderla? Se clicchi Annulla, partirai da zero.',
        confirmText: 'Riprendi',
        cancelText: 'Inizia da zero',
        onConfirm: () => {
          setPdf(file, bytes, 0); // we can safely load, campi were already injected by loadSession
          setDialogInfo(prev => ({ ...prev, isOpen: false }));
        },
        onCancel: () => {
          useAppStore.getState().resetSessione();
          setPdf(file, bytes, 0);
          setDialogInfo(prev => ({ ...prev, isOpen: false }));
        }
      });
    } else {
      useAppStore.getState().resetSessione();
      setPdf(file, bytes, 0);
    }
  };

  const handleDownload = async () => {
    if (!pdfBytes) return;
    try {
      const acroFormBytes = await generaAcroForm(pdfBytes, campi);
      const outputName = pdfName ? pdfName.replace('.pdf', '_acroform.pdf') : 'document_acroform.pdf';
      downloadPdf(acroFormBytes, outputName);
      
      setDialogInfo({
        isOpen: true,
        titolo: 'Successo',
        messaggio: `PDF generato con successo!\n\nCampi totali: ${campi.length}`,
        confirmText: 'OK',
        onConfirm: () => setDialogInfo(prev => ({ ...prev, isOpen: false }))
      });
    } catch (e) {
      console.error(e);
      setDialogInfo({
        isOpen: true,
        titolo: 'Errore',
        messaggio: `Errore durante la generazione del PDF AcroForm.`,
        confirmText: 'OK',
        onConfirm: () => setDialogInfo(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 bg-[#1A1A1A] shrink-0 z-10 relative">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <a href="https://www.sea-srl.it/" target="_blank" rel="noopener noreferrer" className="flex items-center group cursor-pointer transition-transform hover:scale-105">
              <img src={logoBianco} alt="S&A Stay Safe" className="h-[46px] w-auto" />
            </a>
            <div className="h-6 w-px bg-neutral-700 ml-2"></div>
            <div className="flex flex-col justify-center gap-0.5">
              <span className="font-medium text-sm text-white leading-none">Acroform1777</span>
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest leading-none">by Neo1777</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#2D2D2D] hover:bg-[#3D3D3D] rounded text-xs text-white transition-colors flex items-center gap-2"
            >
              Carica PDF
            </button>
            {pdfName && <span className="text-xs text-neutral-400 font-medium truncate max-w-[150px]" title={pdfName}>{pdfName}</span>}
          </div>

          {/* Zoom */}
          <div className="flex items-center space-x-2 bg-[#2D2D2D] rounded px-2 py-1">
            <button
              onClick={() => setScala(scala - 0.25)}
              disabled={!pdfFile || scala <= 0.25}
              className="p-1 text-neutral-400 hover:text-white disabled:opacity-50"
            >
               - 
            </button>
            <span className="text-[11px] font-mono min-w-[40px] text-center text-white">
              {Math.round(scala * 100)}%
            </span>
            <button
              onClick={() => setScala(scala + 0.25)}
              disabled={!pdfFile || scala >= 4.0}
              className="p-1 text-neutral-400 hover:text-white disabled:opacity-50"
            >
               + 
            </button>
          </div>

          {/* Pagination */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPaginaCorrente(Math.max(0, paginaCorrente - 1))}
              disabled={paginaCorrente === 0 || !pdfFile}
              className="text-neutral-400 hover:text-white disabled:opacity-50 text-xs px-1"
            >
              &lsaquo;
            </button>
            <span className="text-xs text-neutral-400">
              Pagina <span className="text-white">{pdfFile ? paginaCorrente + 1 : '-'}</span> / {pdfFile ? totalePagine : '-'}
            </span>
            <button
              onClick={() => setPaginaCorrente(Math.min(totalePagine - 1, paginaCorrente + 1))}
              disabled={paginaCorrente === totalePagine - 1 || !pdfFile}
              className="text-neutral-400 hover:text-white disabled:opacity-50 text-xs px-1"
            >
              &rsaquo;
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSnapGrid(!snapGrid)}
              title="Snap alla griglia"
              className={cn(
                "p-1.5 rounded text-xs transition-colors",
                snapGrid ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"
              )}
            >
              <Grid size={14} />
            </button>
            {snapGrid && (
              <input 
                type="number"
                title="Dimensione griglia (pt)"
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value) || 10)}
                className="w-12 bg-neutral-800 text-white text-xs px-1 py-0.5 rounded border border-neutral-700 focus:outline-none focus:border-neutral-500 text-center"
                min="5" max="100" step="1"
              />
            )}
          </div>

          {/* Draw Mode */}
          <div className="flex bg-[#2D2D2D] rounded p-0.5">
            <button
              onClick={() => setModalitaDisegno('dato')}
              className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-sm text-xs transition-colors",
                modalitaDisegno === 'dato' ? "bg-blue-500/20 text-blue-400 border-blue-500/50 font-semibold border" : "text-neutral-400 hover:text-white border border-transparent"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Dato S&A</span>
            </button>
            <button
              onClick={() => setModalitaDisegno('cliente')}
              className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-sm text-xs transition-colors",
                modalitaDisegno === 'cliente' ? "bg-green-500/20 text-green-400 border-green-500/50 font-semibold border" : "text-neutral-400 hover:text-white border border-transparent"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-green-400/50" />
              <span>Campo Cliente</span>
            </button>
          </div>
          
          <button
            onClick={handleDownload}
            disabled={!pdfFile || campi.length === 0}
            className="flex items-center space-x-2 px-4 py-1.5 bg-brand-red hover:bg-[#D0373D] text-white rounded text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            <span>Esporta PDF</span>
          </button>
        </div>
      </header>
      <ModaleDialogo {...dialogInfo} />
    </>
  );
};

