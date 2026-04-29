# Acroform1777

S&A PDF AcroForm Editor, developed by **Neo1777**.

Questa applicazione web in React/TypeScript permette di caricare documenti PDF e di disegnare in modo fluido e visuale campi form (AcroForm), trasformando un documento statico in un vero ed interattivo PDF form.

## Documentazione

L'applicazione dispone di guide modulari redatte appositamente per le diverse figure:

- 📖 **[Manuale Utente](USER_GUIDE.md)**: Guida dettagliata all'uso, al disegno, alla comprensione dell'interfaccia e alle potenzialità del software per l'utilizzatore finale.
- ⚙️ **[Guida per Sviluppatori](DEVELOPER_GUIDE.md)**: Documentazione approfondita rivolta ai DevOps e programmatori. Espone l'architettura tecnica (React + FabricJS + PDFJS), come viene gestito il rendering e la manipolazione bytes (PDF-lib), il meccanismo delle coordinate e il setup Action per GitHub Pages.

## Deploy su Github Pages

Il setup repository è provvisto di `deploy.yml`. 
Come fare da Github:
1. Assicurati che nel tuo repo, sotto *Settings* > *Pages*, l'origine sia impostata su **GitHub Actions**.
2. Qualsiasi Push o Merge effettuato verso il branch `main` azionerà in autonomia la build e la pubblicazione della nuova versione alla URL della tua github pages associata al repository.
