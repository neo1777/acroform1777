# Acroform1777 - Developer Guide & Architecture

Questo documento espone l'architettura tecnica, lo stack utilizzato e le principali scelte implementative di **Acroform1777**, per lo sviluppatore che voglia subentrare o apprendere i pattern integrati.

## 1. Stack Tecnologico

- **Core Framework**: React 18, alimentato dal build tool Vite (configurazione ESM, target es2022).
- **Linguaggio**: TypeScript per la type safety strutturata estesa anche a moduli visivi.
- **Styling**: Tailwind CSS per scaffolding ultra-veloce tramite pattern utility-first (Zero custom CSS in file separati o moduli). Iconografia gestita da `lucide-react`.
- **State Management**: Zustand (Gestione centralizzata e reattiva ma con pattern hooks-like). Nessun context provider sproporzionato.
- **Rendering Visivo PDF**: Mozilla `pdf.js` (`pdfjs-dist`). Rendering raster del foglio documentale via HTML5 Canvas.
- **Layer di Interazione & Disegno**: `fabric.js`. Il fulcro per catturare eventi mouse, click/drag, box manipolabili in stile editor grafico CAD-like.
- **Esportazione & Alterazione Binaria**: `pdf-lib`. Lo strumento principe usato per manipolare il Buffer dei bytes del pdf per incorporare veri `PDFTextField` interattivi.

## 2. Struttura dei File

La gerarchia dei file rispecchia i principi moderni di SPA per Single Purpose e modularietà:

```text
src/
├── components/          # Elementi reattivi di UI 
│   ├── PDFViewer.tsx    # CUORE del rendering Fabric + PDFJS
│   ├── Sidebar.tsx      # Controlli form, state display
│   ├── Toolbar.tsx      # Layout Action bar alto livello
│   ├── ...              # Altre entità minori
├── lib/
│   └── utils.ts         # Math e conversioni Canvas <-> PDF 
├── store/
│   └── useAppStore.ts   # Modello dei dati Zustand
├── App.tsx              # Macro Layout e Orchestratore
├── main.tsx             # Entrypoint & DOM mounting
└── index.css            # Solo direttive Tailwind CSS
```

## 3. Scelte Architetturali e Tecniche

### 3.1 Il pattern "Doppio Canvas" (PDF.js + Fabric.js)
La scelta più problematica ma efficace presa per questo progetto si trova in `PDFViewer.tsx`.
- **Il livello inferiore:** `pdf.js` preleva il bytes array del pdf, e data la `paginaCorrente` renderizza pixel per pixel i contenuti stampati del PDF su un `HTMLCanvasElement` silente e statico passandogli un determinato contesto. Lo scaling interviene qui per zoomare.
- **Il livello superiore (overlay):** Sulla cima poggia un canvas dinamico di `fabric.js` reso completamente trasparente nel background. 
  
I calcoli e gli offset matematici (spesso dettati in `lib/utils.ts`) sono il ponte. Poiché `pdf-lib` si aspetta coordinate dal vertice in Basso-Sinistra con logica di PostScript point (pt), ed il DOM web usa l'angolo Alto-Sinistra coi Pixel, la fase d'esportazione converte dinamicamente le metriche per incastrarsi perfettamente dov'erano state disegnate.

### 3.2 State Management: Zustand 
Zustand si rivela eccezionale qui. La gestione non è asincrona, non necessita di middleware come redux-thunk e, cosa più importante, ha permesso un'agile serializzazione. 
Lo store conserva in un array di dizionari la lista di tutti i "Campi" disegnati, il loro tipo, x/y, e dimensioni e soprattutto a quale pagina appartengono.
La funzione `saveSession` estrae questo store in stringa JSON per permettere il backup, e `loadSession` deserializza lo store per il ripristino.

### 3.3 Esportazione del file finale (pdf-lib)
La funzione generatrice in `Toolbar.tsx` ri-carica da zero in RAM il bytes array originale tramire il metodo `PDFDocument.load()`.
Si interroga la collection dei campi creati dallo store: 
1. Estrazione form `const form = pdfDoc.getForm()`.
2. Ciclo di ciascun campo: Creazione `form.createTextField(campo.nome)`.
3. Iniezione del widget per il render (l'aspetto visivo del campo che verrà schiacciato sopra al PDF finale) applicando per calcoli i bounding box.
4. Serializzazione finale `save()` del documento PDF e trigger dell'evento di scaricamento tramite `Blob` file.

### 3.4 GitHub YAML Workflow (CI/CD)
Il bundle non gira backend (nessuna chiave di sicurezza sensibile in gioco tra server), tutta la manipolazione e l'uso di memoria avvengono localmente nel browser del client (Client Side App). Questo rende `GitHub Pages` la soluzione zero cost perfetta. Il workflow in `.github/workflows/deploy.yml` intercetta i push su `main`, utilizza `npm run build` costruendo il `vite build` (`dist/`), e carica quegli asset puramente statici (HTML/JS/CSS) nel context di Github Pages.
Il `vite.config.ts` utilizza `base: './'` proprio per prevenire problematiche di path origin.
