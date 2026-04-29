# Acroform1777 - Developer Guide & Architecture

Questo documento espone rigorosamente l'architettura tecnica, lo stack utilizzato e le principali decisioni d'implementazione di **Acroform1777**, indirizzato a DevOps o Engineering Frontend che intendano estendere l'applicazione.

## 1. Stack Tecnologico

- **Core Framework**: React 18, orchestrato tramite il build tool super-veloce Vite (configurazione ESM, target es2022).
- **Linguaggio Primario**: TypeScript per typing rigoroso sui modelli di coordinate, unioni di stato e componenti interattive.
- **Styling UI/UX**: Tailwind CSS sfruttando un approccio utility-first (Zero custom CSS in file separati o moduli frammentati). Iconography scalabile via `lucide-react`. I loghi originali sono inclusi nel filesystem come image assets (`src/assets/*.png`).
- **State Management**: Zustand. Centralizza i side-effects ed accodamenti mutabili in un array di "Campi" virtuali, separato per un ripristino serializzabile e reattivo basato ad hooks. Totalmente esente da Context API overhead.
- **Rendering Visivo PDF**: Mozilla `pdf.js` (`pdfjs-dist`). Rendering rasterizzato client-side del foglio documentale via HTML5 Canvas in background.
- **Layer di Interazione & Disegno**: `fabric.js`. Il fulcro geometrico posizionato in foreground per catturare eventi mouse (Click/Drag/Resize), manipolare box e coordinazione Snap-to-Grid in puro stile CAD-like.
- **Ricostruzione Binaria File & Esportazione**: `pdf-lib`. Strumentazione specializzata per parsare l'array in Bytes originario ed innescarlo con la logica imperativa AcroForm a creazione dei `PDFTextField` interattivi. Inclusione di `fontkit` annesso.

## 2. Architettura File-System

La modularità si espande per competenza logica del dominio o responsabilità Single-Purpose:

```text
src/
├── assets/              # Static media processing (Loghi S&A Stay Safe)
├── components/          # Astrazioni e nodi del DOM Reattivi 
│   ├── PDFViewer.tsx    # IL CUORE. Pone in relazione la ViewFabric con lo sfondo PDFJS
│   ├── Sidebar.tsx      # Controls, State reader, Property editor del campo singolo
│   ├── Toolbar.tsx      # Layout Action bar per I/O (Export/Salvataggio/Config)
│   ├── ModaleNomeCampo.tsx # Astrazione Popup per edit rapido e safe input sanitization
│   └── ...              # Modali e Alert helpers
├── lib/
│   ├── utils.ts         # Math calcs (es. clsx, tailwind-merge)
│   └── pdf-export.ts    # Macro-Azione. Gestisce il PDF-Lib array buffer e le coordinate
├── store/
│   └── useAppStore.ts   # Il modello dati relazionale di Zustand
├── App.tsx              # Router-like Macro Layout e Orchestratore
├── main.tsx             # Entrypoint & DOM mounting target
└── vite-env.d.ts        # TS vite directives
```

## 3. Core Implementation in Dettaglio

### 3.1 Il pattern "Doppio Canvas" in `PDFViewer.tsx`
La barriera logica introdotta consiste in due livelli Canvas disaccoppiati:
- **Background rasterizzato (Z-Index Inferiore):** `pdf.js` preleva il bytes array puro, valuta il context della `paginaCorrente` e renderizza un'immagine bitmap esatta del contenuto PDF sul Canvas inferiore. Nessun livello di manipolazione PDF nativa ha luogo in visualizzazione.
- **Overlay di Interazione (Z-Index Superiore):** Sulla cima siede un canvas dinamico di `fabric.js` allocato in trasparenza totale. Registra posizionamenti cartesiani relativi all'angolo "Alto-Sinistra" e li traduce in poligoni rettangolari.
  
Il posizionamento finale è una mera traduzione matematica (spesso dettata al momento dell'esportazione). `pdf-lib` si aspetta coordinate dal vertice in **Basso-Sinistra** (Y-Axis Inverted) con logica PostScript point (pt). C'è una costante operazione di ricalcolo del pivot nel momento della masterizzazione che fa combaciare le posizioni visuali del DOM Web in posizioni stampate del formato File.

### 3.2 Supporto Font Personalizzati (Unicode e Diacritics)
Nelle prime iterazioni dell'inclusione dei form, `pdf-lib` utilizzava lo Standard 14 ("Helvetica"), che fallisce miserabilmente o collassa di fronte a caratteri non base in determinati lettori di PDF, specialmente per lettere accentate italiane ed eventuali set greci/cirillici.
Questo è stato aggirato in `lib/pdf-export.ts` integrando `@pdf-lib/fontkit`. Al momento dell'esportazione, la pipeline scarica via `fetch` asincrono il font `Roboto.ttf` dalle CDN di Google, lo converte in arrayBuffer() e lo inietta (*embedFont*) globalmente come core font per l'AcroForm Appearance. I problemi dei caratteri accentati, quindi, trovano fine qui.

A supporto dell'input front-end su `ModaleNomeCampo.tsx`, la regex purificatrice non è più `/[^a-zA-Z0-9_]/` (solo ASCII limitata), ma si appoggia al supporto ECMAScript Unicode property escapes `/[^\p{L}\p{N}_]/gu`, garantendo un matching corretto ed esteso delle "Letters" e dei "Numbers" per ogni alfabeto ed accento europeo esistente limitando sempre ai caratteri leciti.

### 3.3 State Management & Ripristino Sessioni via Zustand
Zustand conserva persistentemente in RAM array di oggetti `Campo` formati dal loro UUID, Nome, Assolute in pt, Pagina, Tipologia Red/Blue e Formato custom.
Gli handlers globali (`saveSession` e `loadSession`) si occupano della stringificazione/parsing JSON di un blocco di stato. Non si basano su alcun layer database o localStorage per preservare il privacy scope e l'assenza di retention dei dati; è interamente delegato ad un File system download gestito dall'utente.

### 3.4 Iniezione Tooltip e Validatori nei Campi formattati
Dato che `pdf-lib` a volte difetta di API amichevoli immediate per alcuni valori Acroform speciali (come la stringa di formato, per esempio `gg/mm/aaaa`), la libreria sfrutta la low-level operation sui dizionari PDF nativi.
`fieldRef.set(pdfDoc.context.obj('TU'), PDFHexString.fromText(campo.formato))` interagisce col riferimento "TU" (Tooltip/Alternative Test) e riversa come hex-string l'hint configurato dall'utente, informando il lettore del pdf sull'etichetta invisibile del campo associato. `campo.tipo === 'dato'` chiude l'interazione invocando programmaticamente `textField.enableReadOnly()`.

### 3.5 GitHub Runner e Deploy Action
Incluso in `.github/workflows/deploy.yml` vi è il pattern per il deployment. 
Di rilievo è la garanzia di sicurezza con le GitHub actions in deprezzamento (deprecation warning per Node20). Lo script imposta l'ecosistema del runner target a `node-version: 22` ed abilita l'environment `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` per assicurarsi forward-compatibility con le action correnti del worker CI/CD e prolungarne la stabilità negli anni a seguire in ottica degli update programmati a Giugno e Settembre 2026.
L'app compila col comando `npm run build` costruendo il `dist/` ed esegue l'upload tramite le actions di build in context path relativi (`base: './'` nel server entry), garantendo una esecuzione fluida su GitHub Pages totalmente statica e agnostica ad architetture backend.
