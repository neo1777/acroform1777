# S&A Acroform1777 - Manuale Utente

Benvenuto nel manuale d'uso di **Acroform1777**, lo strumento sviluppato per S&A Stay Safe diretto a facilitare e velocizzare la creazione di form PDF compilabili (AcroForm).

Questo applicativo permette a chiunque di importare documenti PDF standard e di sovrapporre campi testuali interattivi, definendone la titolarità (dati aziendali interni o dati da compilare da parte del cliente finale) e le regole di formato.

## 1. Panoramica dell'Interfaccia

L'interfaccia utente è suddivisa in tre aree principali:
- **Toolbar Superiore**: Contiene i comandi principali per caricare documenti, navigare tra le pagine, selezionare gli strumenti di disegno (Dato o Cliente), attivare la griglia di precisione ed eseguire salvataggi ed esportazioni.
- **Area di Lavoro Centrale**: È il visualizzatore del PDF. Qui potrai fisicamente "disegnare" i campi usando il mouse.
- **Sidebar Destra (Proprietà)**: Un pannello dedicato al controllo di fino. Mostra l'elenco dei campi creati e le proprietà del campo correntemente selezionato.

## 2. Guida Passo-Passo (Tutorial)

### 2.1 Caricamento del Documento
1. Clicca sul pulsante **"Carica PDF"** situato nella barra in alto. Seleziona un file `.pdf` dal tuo computer.
2. Attendere il termine dell'elaborazione. Una volta completato, verrà visualizzata la prima pagina del documento. Puoi scorrerle usando i pulsanti di navigazione `‹` e `›`.

### 2.2 Disegno dei Campi
L'app gestisce tre "Strumenti" o modalità (attivabili dalla Toolbar):
- **Campi S&A (Rosso)**: Seleziona questa modalità per disegnare campi che dovranno essere compilati internamente o che rappresentano dati aziendali.
- **Cliente (Blu)**: Campi pensati per essere interattivi per il cliente (es. firma, moduli da riempire in autonomia).
- **Controllo (Verde - Solo Selezione)**: Attivando l'icona del cursore si esce dalla modalità di disegno per poter selezionare, spostare o ridimensionare campi già creati senza disegnarne accidentalmente di nuovi.

**Come disegnare:**
1. Seleziona il tipo di campo (S&A o Cliente).
2. Clicca e trascina con il mouse sopra l'area del PDF in cui desideri inserire il campo. Apparirà un rettangolo colorato.

**Uso della Griglia di Precisione (Snap to Grid):**
Per allineare perfettamente i campi, clicca sull'icona della **Griglia** nella toolbar. Apparirà uno sfondo quadrettato e potrai regolarne liberamente la dimensione (da 5 a 100 pt) grazie al box numerico che comparirà di fianco all'icona.

### 2.3 Modifica e Personalizzazione
Modificare le proprietà di un campo è semplice:
1. Assicurati che lo strumento "Cursore" sia attivo.
2. Clicca su un campo disegnato nell'area di lavoro (puoi anche muoverlo e ridimensionarlo tramite le maniglie ai bordi).
3. Rivolgi l'attenzione alla **Sidebar** a destra:
   - **Nome Campo**: Modifica il nome (molto importante per recuperare in futuro il dato per automazioni). L'app assegnerà nomi numerici sequenziali per velocizzare, ma puoi usare nomi discorsivi (es. `DataDiNascita`).
   - **Coordinate**: Se hai bisogno del massimo controllo, edita le coordinate X/Y e le dimensioni Larghezza/Altezza manualmente. I cambiamenti si rifletteranno subito nel disegno.
   - **Formato/Maschera**: Cassa dedicata in cui potrai inserire una regola formattativa fissa o convenzionale (es. `gg/mm/aaaa` o `€ #.##0,00`). Queste regole vengono salvate a livello del campo.

### 2.4 Eliminazione dei Campi
Per rimuovere un campo, selezionalo e utilizza il cestino presente nella sua scheda corrispondente sulla griglia della Sidebar.

### 2.5 Salvataggio e Ripristino del Lavoro Incompiuto (Sessioni)
Se un documento è molto lungo e hai bisogno di interrompere:
1. Clicca su **"Salva Sessione"** nella toolbar.
2. Verrà generato un file `.json` che conserverà tutto il tuo lavoro e le coordinate dei campi.
3. In un momento futuro, ti basterà importare di nuovo "lo stesso" PDF. L'app rileverà le forme e ti proporrà di caricare il progresso salvato se posizioni il `.json` o tramite il pulsante apposito.

### 2.6 Esportazione Finale (Genera PDF Form)
Quando hai concluso il mapping della tua pagina o dell'intero fascicolo, clicca sul grande pulsante **"Genera PDF"**.
Verrà scaricata una versione finale del tuo documento (il nome originale sarà mantenuto più un suffisso identificativo) in cui i rettangoli colorati saranno trasformati in veri e propri moduli interattivi (Testo) compilabili con Adobe Acrobat Reader, Google Chrome e software affini.
