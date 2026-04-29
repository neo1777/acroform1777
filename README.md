# Acroform1777

S&A PDF AcroForm Editor, developed by **Neo1777**.

Questa applicazione web permette di caricare documenti PDF e di disegnare agevolmente campi form (AcroForm) suddividendoli tra:
- **Dati S&A**: per la compilazione interna.
- **Campi Cliente**: che andranno compilati dal cliente.

## Funzionalità principali
- **Caricamento PDF**: permette di caricare qualsiasi documento PDF e definire i campi nelle varie pagine.
- **Griglia di Snap**: per allineare perfettamente i campi durante il disegno, utile per l'alta precisione. (Novità v1.1.0: personalizzazione della tolleranza della griglia direttamente in Toolbar).
- **Tipologia Campi**: classificazione automatica per campi e validazioni visuali (rosso/blu/verde per distinguere la proprietà).
- **Formattazione Campi**: possibilità di applicare una maschera di formattazione sui campi (Testo, Data, Numero).
- **Output Standard**: produce in export file AcroForm PDF standard compatibili con tutti i lettori Acrobat, con proprietà integrate.

## Aggiornamento v1.1.0
- **Formato Personalizzato**: È stato introdotto un campo nella sidebar permettendo all'utente di definire un formato personale, definendo una maschera (es: `gg/mm/aaaa` o numerici) che verrà salvata come attributo del campo.
- **Griglia di Snap Editabile**: Aggiunto un controllo `input number` nella toolbar che si rivela attivamente abilitando lo Snap Griglia. Permette di variare dinamicamente la dimensione in pt (da 5 a 100 pt) per posizionamenti accurati.
- **Estetica Aziendale**: Inclusione del brand `S&A Stay Safe` e relativi link panoramici, e aggiornamento firme d'autore.

## Tecnologie e Dipendenze
- **React.js** e **Vite** come base del framework SPA.
- **Zustand** come store globale per gestire lo stato locale e di sessione di editing PDF.
- **Fabric.js** per il rendering del Canvas che intercetta i disegni dei campi posizionati on top del PDF.
- **Pdf.js** (Mozilla) per processamento visibile e rastering dei documenti.
- **PDF-Lib** per la modifica binaria del file e l'injecting di metadati AcroForm.

## Sviluppo e Deployment
Sviluppato all'interno di Google AI Studio. È possibile fare un mirror su Github e configurare l'action `.github/workflows/deploy.yml` per erogare la soluzione tramite Github Pages.
