import { create } from 'zustand';
import * as localforage from 'localforage';

export type TipoCampo = 'dato' | 'cliente';

export interface Campo {
  id: string;
  nome: string;
  tipo: TipoCampo;
  pagina: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  formato?: string;
}

export interface PdfDimensions {
  width: number;
  height: number;
}

interface AppState {
  pdfFile: File | null;
  pdfBytes: ArrayBuffer | null;
  pdfName: string | null;
  pdfDimensions: Record<number, PdfDimensions>; // pageIndex -> dimensions
  
  campi: Campo[];
  paginaCorrente: number;
  totalePagine: number;
  scala: number;
  modalitaDisegno: TipoCampo;
  campoSelezionato: string | null;
  snapGrid: boolean;
  gridSize: number;

  // Actions
  setPdf: (file: File | null, bytes: ArrayBuffer | null, totalePagine: number) => void;
  setPdfDimensions: (pagina: number, dimensions: PdfDimensions) => void;
  addCampo: (campo: Omit<Campo, 'id'> & {id?: string}) => void;
  updateCampo: (id: string, updates: Partial<Campo>) => void;
  removeCampo: (id: string) => void;
  setPaginaCorrente: (p: number) => void;
  setTotalePagine: (t: number) => void;
  setScala: (s: number) => void;
  setModalitaDisegno: (m: TipoCampo) => void;
  setCampoSelezionato: (id: string | null) => void;
  setSnapGrid: (s: boolean) => void;
  setGridSize: (s: number) => void;

  saveSession: () => Promise<void>;
  loadSession: (nomeFile: string) => Promise<boolean>;
  resetSessione: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  pdfFile: null,
  pdfBytes: null,
  pdfName: null,
  pdfDimensions: {},
  campi: [],
  paginaCorrente: 0,
  totalePagine: 0,
  scala: 1.5,
  modalitaDisegno: 'dato',
  campoSelezionato: null,
  snapGrid: false,
  gridSize: 10,

  setPdf: (file, bytes, totalePagine) => set({ pdfFile: file, pdfBytes: bytes, pdfName: file?.name || null, totalePagine, paginaCorrente: 0, pdfDimensions: {} }),
  setPdfDimensions: (pagina, dimensions) => set((state) => ({
    pdfDimensions: { ...state.pdfDimensions, [pagina]: dimensions }
  })),
  
  addCampo: (campo) => {
    const id = campo.id || crypto.randomUUID();
    set((state) => ({ campi: [...state.campi, { ...campo, id } as Campo], campoSelezionato: id }));
    get().saveSession();
  },
  
  updateCampo: (id, updates) => {
    set((state) => ({
      campi: state.campi.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
    get().saveSession();
  },
  
  removeCampo: (id) => {
    set((state) => ({
      campi: state.campi.filter(c => c.id !== id),
      campoSelezionato: state.campoSelezionato === id ? null : state.campoSelezionato
    }));
    get().saveSession();
  },
  
  setPaginaCorrente: (p) => set({ paginaCorrente: p, campoSelezionato: null }),
  setTotalePagine: (t) => set({ totalePagine: t }),
  setScala: (s) => set({ scala: Math.max(0.2, Math.min(s, 5.0)) }),
  setModalitaDisegno: (m) => set({ modalitaDisegno: m }),
  setCampoSelezionato: (id) => set({ campoSelezionato: id }),
  setSnapGrid: (s) => set({ snapGrid: s }),
  setGridSize: (s) => set({ gridSize: Math.max(5, Math.min(s, 100)) }),
  
  saveSession: async () => {
    const state = get();
    if (state.pdfName) {
      await localforage.setItem(`pdf-session-${state.pdfName}`, state.campi);
    }
  },
  
  loadSession: async (nomeFile: string) => {
    try {
      const savedCampi = await localforage.getItem<Campo[]>(`pdf-session-${nomeFile}`);
      if (savedCampi && savedCampi.length > 0) {
        set({ campi: savedCampi });
        return true;
      }
    } catch (e) {
      console.error('Failed to load session', e);
    }
    return false;
  },

  resetSessione: () => {
    set({
      pdfFile: null,
      pdfBytes: null,
      pdfName: null,
      pdfDimensions: {},
      campi: [],
      paginaCorrente: 0,
      totalePagine: 0,
      scala: 1.5,
      campoSelezionato: null,
    });
  }
}));
