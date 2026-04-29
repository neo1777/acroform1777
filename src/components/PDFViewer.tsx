import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { fabric } from 'fabric';
import { useAppStore } from '../store/useAppStore';
import { screenRectToPdf, pdfRectToScreen } from '../lib/utils';
import { v4 as uuidv4 } from 'uuid';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PDFViewerProps {
  onCampoDrawn: (rect: { x: number; y: number; width: number; height: number }) => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ onCampoDrawn }) => {
  const {
    pdfBytes,
    paginaCorrente,
    scala,
    setTotalePagine,
    setPdfDimensions,
    pdfDimensions,
    campi,
    modalitaDisegno,
    updateCampo,
    campoSelezionato,
    setCampoSelezionato,
    snapGrid,
    gridSize: storeGridSize
  } = useAppStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricWrapperRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const isDrawingRef = useRef(false);
  const drawingRectRef = useRef<fabric.Rect | null>(null);
  const originRef = useRef<{x: number, y: number} | null>(null);

  // Initialize PDF Document
  useEffect(() => {
    if (!pdfBytes) return;
    
    // Copy the ArrayBuffer because PDF.js might detach it
    const bytesCopy = pdfBytes.slice(0);
    const task = pdfjsLib.getDocument(bytesCopy);
    
    task.promise.then((doc) => {
      setPdfDoc(doc);
      setTotalePagine(doc.numPages);
    }).catch((e: Error) => {
      if (e.name !== 'RenderingCancelledException' && e.name !== 'WorkerDestroyedException' && e.message !== 'Worker was destroyed') {
        console.error('PDF Load Error:', e);
      }
    });
    
    return () => {
      task.destroy();
    }
  }, [pdfBytes, setTotalePagine]);

  // Render PDF Page
  useEffect(() => {
    if (!pdfDoc || !pdfCanvasRef.current || !fabricWrapperRef.current || !containerRef.current) return;

    let isCancelled = false;
    let renderTask: pdfjsLib.RenderTask | null = null;
    
    pdfDoc.getPage(paginaCorrente + 1).then((page) => {
      if (isCancelled) return;
      const viewport = page.getViewport({ scale: scala });
      const currentDim = pdfDimensions[paginaCorrente];
      
      // Store actual PDF pt dimensions (viewport with scale 1)
      if (!currentDim) {
        const unscaledViewport = page.getViewport({ scale: 1 });
        setPdfDimensions(paginaCorrente, { width: unscaledViewport.width, height: unscaledViewport.height });
      }

      const canvas = pdfCanvasRef.current!;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      if (isCancelled) return;
      renderTask = page.render(renderContext);
      
      renderTask.promise.then(() => {
        if (isCancelled) return;
        // Setup fabric canvas
        if (!fabricCanvas && fabricWrapperRef.current) {
          const newCanvas = document.createElement('canvas');
          fabricWrapperRef.current.appendChild(newCanvas);
          const fc = new fabric.Canvas(newCanvas, {
            selection: false,
            preserveObjectStacking: true,
          });
          fc.setDimensions({ width: viewport.width, height: viewport.height });
          setFabricCanvas(fc);
        } else if (fabricCanvas) {
          fabricCanvas.setDimensions({ width: viewport.width, height: viewport.height });
          fabricCanvas.renderAll();
        }
      }).catch((e: Error) => {
        if (e.name !== 'RenderingCancelledException' && e.message !== 'Worker was destroyed' && e.message !== 'Rendering cancelled, page 1') {
          console.error('PDF Render Error:', e);
        }
      });
    }).catch((e: Error) => {
      if (e.name !== 'RenderingCancelledException' && e.message !== 'Worker was destroyed') {
        console.error('PDF Get Page Error:', e);
      }
    });

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, paginaCorrente, scala, setPdfDimensions]); // Removed pdfDimensions to avoid re-triggering on first load

  // Sync fabric fields with Zustand campi
  useEffect(() => {
    if (!fabricCanvas || !pdfDimensions[paginaCorrente]) return;

    const pdfHeight = pdfDimensions[paginaCorrente].height;
    const currentCampi = campi.filter(c => c.pagina === paginaCorrente);
    
    const existingObjects = fabricCanvas.getObjects();
    const currentIds = new Set(currentCampi.map(c => c.id));

    // Rimuovi gli oggetti non più nei campi (o che non appartengono a questa pagina)
    // Escludendo il rettangolo che si sta attualmente disegnando
    existingObjects.forEach(obj => {
      if (obj === drawingRectRef.current) return;
      if (obj.data?.id && !currentIds.has(obj.data.id)) {
        fabricCanvas.remove(obj);
      }
    });

    currentCampi.forEach(campo => {
      const screenRect = pdfRectToScreen(
        { x: campo.x, y: campo.y, width: campo.width, height: campo.height },
        pdfHeight,
        scala
      );

      const isDato = campo.tipo === 'dato';
      const color = isDato ? 'rgba(59, 130, 246, 0.3)' : 'rgba(34, 197, 94, 0.3)';
      const strokeColor = isDato ? '#3B82F6' : '#22C55E';

      const existingRect = existingObjects.find(o => o.type === 'rect' && o.data?.id === campo.id);
      const existingText = existingObjects.find(o => o.type === 'text' && o.data?.id === campo.id);

      if (existingRect && existingText) {
        // Aggiorna senza distruggere (permette a fabric di mantenere la selezione e i controlli attivi)
        existingRect.set({
          left: screenRect.left,
          top: screenRect.top,
          width: screenRect.width,
          height: screenRect.height,
          scaleX: 1, // Resettiamo la scala per via dei ridimensionamenti manuali
          scaleY: 1,
          fill: color,
          stroke: strokeColor,
          cornerColor: strokeColor,
        });
        existingText.set({
          left: screenRect.left + 4,
          top: screenRect.top + 4,
          text: campo.nome,
          fill: strokeColor,
          fontSize: Math.max(10, 12 * scala),
        });
      } else {
        // Crea nuovo oggetto sulla canvas
        const rect = new fabric.Rect({
          left: screenRect.left,
          top: screenRect.top,
          width: screenRect.width,
          height: screenRect.height,
          fill: color,
          stroke: strokeColor,
          strokeWidth: 2,
          cornerColor: strokeColor,
          cornerSize: 8,
          transparentCorners: false,
          hasControls: true,
          hasBorders: true,
          lockRotation: true,
          data: { id: campo.id },
        });

        const text = new fabric.Text(campo.nome, {
          left: screenRect.left + 4,
          top: screenRect.top + 4,
          fontSize: Math.max(10, 12 * scala),
          fill: strokeColor,
          fontFamily: 'IBM Plex Sans',
          selectable: false,
          evented: false,
          data: { id: campo.id },
        });

        fabricCanvas.add(rect);
        fabricCanvas.add(text);
        
        // Mantieni il testo allineato al rettangolo durante lo spostamento
        rect.on('moving', () => {
          text.set({ left: rect.left! + 4, top: rect.top! + 4 });
        });
        rect.on('scaling', () => {
          text.set({ left: rect.left! + 4, top: rect.top! + 4 });
        });
      }
    });

    fabricCanvas.renderAll();
  }, [fabricCanvas, campi, paginaCorrente, scala, pdfDimensions]);

  // Handle active object selection from Zustand state
  useEffect(() => {
    if (!fabricCanvas) return;
    
    if (!campoSelezionato) {
      fabricCanvas.discardActiveObject();
    } else {
      const selectedObj = fabricCanvas.getObjects().find(o => o.type === 'rect' && o.data?.id === campoSelezionato);
      if (selectedObj && fabricCanvas.getActiveObject() !== selectedObj) {
        fabricCanvas.setActiveObject(selectedObj);
      }
    }
    fabricCanvas.renderAll();
  }, [fabricCanvas, campoSelezionato]);

  // Handle fabric events
  useEffect(() => {
    if (!fabricCanvas || !pdfDimensions[paginaCorrente]) return;

    const pdfHeight = pdfDimensions[paginaCorrente].height;
    const gridPt = storeGridSize;
    const gridSize = gridPt * scala;

    const handleMouseDown = (o: fabric.IEvent) => {
      fabricCanvas.calcOffset();
      
      if (o.target) {
        const id = o.target.data?.id;
        if (id) setCampoSelezionato(id);
        return;
      }

      // Start drawing
      isDrawingRef.current = true;
      const pointer = fabricCanvas.getPointer(o.e);
      
      const isDato = modalitaDisegno === 'dato';
      const color = isDato ? 'rgba(59, 130, 246, 0.3)' : 'rgba(34, 197, 94, 0.3)';
      const strokeColor = isDato ? '#3B82F6' : '#22C55E';

      const startX = snapGrid ? Math.round(pointer.x / gridSize) * gridSize : pointer.x;
      const startY = snapGrid ? Math.round(pointer.y / gridSize) * gridSize : pointer.y;

      originRef.current = { x: startX, y: startY };

      const rect = new fabric.Rect({
        left: startX,
        top: startY,
        width: 0,
        height: 0,
        fill: color,
        stroke: strokeColor,
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });

      drawingRectRef.current = rect;
      fabricCanvas.add(rect);
    };

    const handleMouseMove = (o: fabric.IEvent) => {
      if (!isDrawingRef.current || !drawingRectRef.current || !originRef.current) return;
      const pointer = fabricCanvas.getPointer(o.e);
      
      let x = snapGrid ? Math.round(pointer.x / gridSize) * gridSize : pointer.x;
      let y = snapGrid ? Math.round(pointer.y / gridSize) * gridSize : pointer.y;

      const originX = originRef.current.x;
      const originY = originRef.current.y;

      drawingRectRef.current.set({
        left: Math.min(originX, x),
        top: Math.min(originY, y),
        width: Math.abs(x - originX),
        height: Math.abs(y - originY),
      });

      fabricCanvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawingRef.current || !drawingRectRef.current) return;
      isDrawingRef.current = false;

      const rect = drawingRectRef.current;
      if (rect.width! > 10 && rect.height! > 10) {
        // Convert screen to PDF
        const pdfRect = screenRectToPdf(
          {
            left: rect.left!,
            top: rect.top!,
            width: rect.width!,
            height: rect.height!,
          },
          fabricCanvas.height!,
          scala,
          pdfHeight
        );
        
        onCampoDrawn(pdfRect);
      }

      fabricCanvas.remove(rect);
      drawingRectRef.current = null;
    };

    const handleObjectModified = (e: fabric.IEvent) => {
      const target = e.target;
      if (!target || !target.data?.id) return;
      
      // Calculate true width/height after scaling
      const width = target.width! * (target.scaleX || 1);
      const height = target.height! * (target.scaleY || 1);
      
      let left = target.left!;
      let top = target.top!;

      if (snapGrid) {
        left = Math.round(left / gridSize) * gridSize;
        top = Math.round(top / gridSize) * gridSize;
        target.set({ left, top });
      }

      const pdfRect = screenRectToPdf(
        { left, top, width, height },
        fabricCanvas.height!,
        scala,
        pdfHeight
      );

      // reset scale to 1 for next computations
      target.set({
        scaleX: 1,
        scaleY: 1,
        width,
        height
      });

      updateCampo(target.data.id, {
        x: pdfRect.x,
        y: pdfRect.y,
        width: pdfRect.width,
        height: pdfRect.height
      });
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('object:modified', handleObjectModified);

    // Click outside to deselect
    const handleSelectionCleared = () => setCampoSelezionato(null);
    fabricCanvas.on('selection:cleared', handleSelectionCleared);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
      fabricCanvas.off('object:modified', handleObjectModified);
      fabricCanvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [fabricCanvas, modalitaDisegno, onCampoDrawn, pdfDimensions, paginaCorrente, scala, updateCampo, snapGrid, storeGridSize, setCampoSelezionato]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center min-h-full origin-top-left py-8"
    >
      <div 
        className="relative shadow-2xl bg-white border border-gray-300 mx-auto box-content" 
        style={{ 
          width: pdfDimensions[paginaCorrente] ? pdfDimensions[paginaCorrente].width * scala : 'auto', 
          height: pdfDimensions[paginaCorrente] ? pdfDimensions[paginaCorrente].height * scala : 'auto' 
        }}
      >
        <canvas ref={pdfCanvasRef} className="absolute top-0 left-0" />
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', 
            backgroundSize: `${storeGridSize * scala}px ${storeGridSize * scala}px`,
            display: snapGrid ? 'block' : 'none'
          }} 
        />
        <div className="absolute top-0 left-0 w-full h-full" ref={fabricWrapperRef} />
      </div>
    </div>
  );
};
