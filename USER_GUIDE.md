# S&A Acroform1777 - Manuale Utente

Benvenuto nel manuale d'uso di **Acroform1777**, lo strumento sviluppato per S&A Stay Safe, diretto a facilitare e velocizzare la creazione di form PDF compilabili (AcroForm).

Questo applicativo permette a chiunque di importare documenti PDF standard e di sovrapporre campi testuali interattivi, definendone la titolarità (dati aziendali interni o dati da compilare da parte del cliente finale) e regole di formato personalizzate.

## 1. Panoramica dell'Interfaccia

L'interfaccia utente è suddivisa in tre aree principali:
- **Toolbar Superiore**: Contiene l'identità S&A Stay Safe ed i comandi principali per caricare documenti, navigare tra le pagine, selezionare gli strumenti di disegno (S&A o Cliente), attivare la griglia di precisione ed eseguire salvataggi ed esportazioni ("Esporta PDF").
- **Area di Lavoro Centrale**: È il visualizzatore del PDF. Qui potrai fisicamente "disegnare" i campi usando il mouse tracciando dei rettangoli sul documento.
- **Sidebar Destra (Proprietà)**: Un pannello dedicato al controllo di fino. Mostra l'elenco riepilogativo di tutti i campi creati nella pagina in corso e le proprietà del campo correntemente selezionato o dell'intero documento.

## 2. Guida Passo-Passo (Tutorial)

### 2.1 Caricamento del Documento
1. Clicca sul pulsante **"Carica PDF"** situato nella barra in alto. Seleziona un file `.pdf` dal tuo computer.
2. Attendere il termine dell'elaborazione. Una volta completato, verrà visualizzata la prima pagina del documento. Puoi scorrerle fluidamente usando i pulsanti di navigazione `‹` e `›` in alto a destra.

### 2.2 Disegno e Posizionamento dei Campi
L'app gestisce tre "Strumenti" o modalità (attivabili liberamente dalla Toolbar):
- **Campi S&A (Rosso)**: Seleziona questa modalità per disegnare campi che dovranno essere compilati internamente o che rappresentano dati aziendali. Questi campi, una volta esportato il PDF, saranno impostati in modalità "Read-Only" (Sola lettura) e non modificabili dai clienti destinatari nel lettore PDF.
- **Campi Cliente (Blu)**: Campi pensati per essere interattivi per il cliente (es. firma, campi da riempire in autonomia per l'input dati).
- **Controllo (Verde - Solo Selezione)**: Attivando l'icona del cursore si esce dalla modalità di disegno per poter selezionare, spostare o ridimensionare campi già creati senza disegnarne accidentalmente di nuovi.

**Come disegnare:**
1. Seleziona il tipo di campo (S&A o Cliente).
2. Clicca e trascina con il mouse sopra l'area del PDF in cui desideri inserire il campo. Apparirà un rettangolo colorato.

**Uso della Griglia di Precisione (Snap to Grid):**
Per allineare verticalmente e orizzontalmente in modo perfetto i campi, clicca sull'icona della **Griglia** nella toolbar. Apparirà un overlay quadrettato. Potrai regolarne liberamente la tolleranza e dimensione (da 5 a 100 pt) grazie al contatore che si abiliterà di fianco all'icona.

### 2.3 Modifica e Personalizzazione (Formato e Nomenclatura)
Modificare le proprietà di un campo è semplice:
1. Assicurati che lo strumento "Cursore" sia attivo.
2. Clicca su un campo disegnato nell'area di lavoro (puoi muoverlo e ridimensionarlo tramite le maniglie angolari ai bordi).
3. Rivolgi l'attenzione alla **Sidebar** a destra per calibrare i metadati:
   - **Nome Campo**: Modifica il nome del campo. L'interfaccia supporta l'inserimento di lettere internazionali e caratteri accentati (es. `Società`), rimuovendo in sicurezza i caratteri illeciti. L'app assegnerà nomi numerici sequenziali standard, ma si consigliano nomi descrittivi unici per recuperare in futuro il dato tramite software.
   - **Coordinate**: Se hai bisogno del massimo controllo matematico, edita le coordinate assolute `X/Y` e le dimensioni `Larghezza/Altezza` manualmente. I cambiamenti si rifletteranno contestualmente nel disegno.
   - **Formato/Maschera**: Cassa dedicata in cui potrai inserire una regola formattativa fissa o convenzionale (es. `gg/mm/aaaa` o `€ #.##0,00`). Queste regole vengono salvate a livello del campo ed appariranno come Tooltip nell'export finale a guida per chi compila.

### 2.4 Eliminazione dei Campi
Per rimuovere un campo, selezionalo ed utilizza l'icona di cancellazione (cestino) presente nella sua "scheda" corrispondente nel riepilogo laterale della Sidebar.

### 2.5 Salvataggio e Ripristino del Lavoro (Work in progress)
Se una pratica è molto lunga e si ha necessità di interrompere:
1. Clicca su **"Salva Sessione"** nella toolbar.
2. Verrà generato un file di backup `.json` istantaneo che conserverà tutto l'albero del tuo lavoro, le coordinate, i formati e la tipologia (azienda/cliente) associati alle rispettive pagine.
3. In un momento futuro, ti basterà re-importare "lo stesso" layout del PDF pulito ed usare il pulsante **"Carica Sessione"** per re-immettere il `.json`. L'app applicherà i dati riportandoti esattamente a dove eri rimasto, come per magia.

### 2.6 Generazione ed Ottenimento del Form Interattivo
Quando hai concluso il mapping di tutti i box di raccolta nelle varie pagine, clicca sul pulsante rosso con icona ed etichetta **"Esporta PDF"** in alto a destra.

Verrà elaborata a pieno ritmo e scaricata una versione finale originata a partire dal tuo documento natio; i rettangoli cromatici virtuali saranno fusi e trasformati in veri e propri moduli interattivi PDF (Campi Testo standard) pienamente compatibili col font universale e pronti alla compilazione tramite Adobe Acrobat Reader, FoxitPDF, e qualsiasi Web Browser odierno.
