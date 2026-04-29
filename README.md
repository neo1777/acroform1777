# Acroform1777

S&A PDF AcroForm Editor, developed by **Neo1777**.

Questa applicazione web in React/TypeScript permette di caricare documenti PDF e di disegnare in modo fluido e visuale campi form (AcroForm), trasformando un documento statico in un vero ed interattivo PDF form compilabile.
È stata progettata per S&A Stay Safe per velocizzare la mappatura e la creazione di moduli digitali.

## Funzionalità principali

- **Rendering Fedele**: Visualizza il documento PDF caricato con un layer di disegno interattivo sovrapposto.
- **Tipologia Campi**: Classificazione automatica per proprietà (Campi S&A per uso interno in rosso, Campi Cliente in blu).
- **Controllo di Precisione**: Griglia di snap personalizzabile (da 5 a 100 pt) per un allineamento perfetto dei campi.
- **Supporto Esteso ai Caratteri**: Gestione nativa per caratteri accentati ed internazionali nei nomi dei campi e all'interno del PDF generato (inclusione font Roboto).
- **Formattazione e Maschere**: Applicazione di Tooltip (TU) e specifiche di formato (es. data, valuta) direttamente incapsulate nel widget del PDF form.
- **Salvataggio Sessioni**: Esporta la "mappatura" in formato JSON per riprendere il lavoro in un secondo momento, reimportandola sullo stesso layout.

## Documentazione

L'applicazione dispone di guide modulari redatte appositamente per le diverse figure:

- 📖 **[Manuale Utente](USER_GUIDE.md)**: Guida dettagliata all'uso, al disegno, alla comprensione dell'interfaccia e alle potenzialità del software per l'utilizzatore finale.
- ⚙️ **[Guida per Sviluppatori](DEVELOPER_GUIDE.md)**: Documentazione approfondita rivolta ai DevOps e programmatori. Espone l'architettura tecnica (React + FabricJS + PDFJS), come viene gestito il rendering e la manipolazione bytes (PDF-lib), il meccanismo delle coordinate e il setup Action per GitHub Pages.

## Tecnologie e Dipendenze
- **React.js 18** e **Vite** come base del framework SPA.
- **Zustand** come store globale per gestire lo stato locale e di sessione di editing PDF.
- **Fabric.js** per il rendering del Canvas che intercetta i disegni dei campi posizionati on top del PDF.
- **Pdf.js (Mozilla)** per processamento visibile e rastering dei documenti attraverso rendering HTML5 Canvas.
- **PDF-Lib** per la modifica binaria del file, l'incorporazione dei font personalizzati e l'injecting di metadati AcroForm.
- **Tailwind CSS** per styling tramite utility classes fluide ed adeguate.

## Deploy su Github Pages

Il setup repository è provvisto di workflow GitHub Actions integrato (`.github/workflows/deploy.yml`) già aggiornato agli standard Node.js 24/22. 
Come fare da Github:
1. Assicurati che nel tuo repo, sotto *Settings* > *Pages*, l'origine sia impostata su **GitHub Actions**.
2. Qualsiasi Push o Merge effettuato verso il branch `main` azionerà in autonomia la build e la pubblicazione della nuova versione alla URL della tua github pages associata al repository.
