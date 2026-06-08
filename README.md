# Passify

Un'app web per studiare e simulare esami a partire da file JSON di domande. Carica il tuo file, configura il quiz e inizia a studiare — nessun backend, nessun account.

---

## Funzionalità

- **Caricamento JSON** via drag & drop o file picker, oppure scegli uno degli esami di esempio inclusi
- **Modalità Pratica** — feedback immediato dopo ogni risposta con evidenziazione corretto/sbagliato e link alla discussione originale
- **Modalità Esame** — simulazione reale: nessun feedback durante il quiz, punteggio e revisione degli errori alla fine
- **Domande multi-risposta** — quando la risposta corretta ha più opzioni vengono mostrate come checkbox con hint sul numero da selezionare
- **Configurazione flessibile** — scegli quante domande fare, filtra per topic e attiva il rimescolamento casuale di domande e opzioni
- **Revisione errori** — schermata finale con tutte le domande sbagliate, la tua risposta, la risposta corretta e il link alla discussione
- **Salvataggio sessione** — il progresso viene salvato in localStorage; se esci e riapri l'app puoi riprendere da dove eri rimasto
- **Tema chiaro / scuro** — rilevato automaticamente dalle preferenze di sistema, modificabile con il toggle in alto a destra
- **Interfaccia IT / EN** — switcher di lingua nella topbar; la scelta viene ricordata

---

## Esami inclusi

| Esame | Domande |
|---|---|
| Professional Cloud Developer | 288 |
| Professional Cloud DevOps Engineer | 203 |

---

## Formato JSON supportato

L'app accetta qualsiasi file JSON che rispetti questa struttura:

```json
{
  "exam": "Nome dell'esame",
  "questions": [
    {
      "id": 1,
      "topic": 1,
      "question": "Testo della domanda",
      "options": {
        "A": "Prima opzione",
        "B": "Seconda opzione",
        "C": "Terza opzione",
        "D": "Quarta opzione"
      },
      "answer": "B",
      "timestamp": "2024-01-01",
      "url": "https://link-alla-discussione.com"
    }
  ]
}
```

| Campo | Tipo | Note |
|---|---|---|
| `exam` | `string` | Nome visualizzato nell'app |
| `questions` | `array` | Array non vuoto di domande |
| `id` | `number` | Identificativo univoco |
| `topic` | `number` | Usato per il filtro per topic |
| `question` | `string` | Testo della domanda |
| `options` | `object` | Da 3 a 5 opzioni con chiavi `A`–`E` |
| `answer` | `string` | Una o più lettere (es. `"B"` o `"BE"` per multi-risposta) |
| `timestamp` | `string` | Qualsiasi formato testuale |
| `url` | `string` | Link alla discussione (opzionale ma consigliato) |
| `image_urls` | `string[]` | Lista di URL immagini da mostrare nella domanda (opzionale) |

---

## Stack tecnico

- **React 19** + **TypeScript**
- **Vite** come bundler e dev server
- **CSS Modules** con custom properties — nessuna libreria UI esterna
- Stato gestito con `useReducer` locale — nessun Redux o Zustand
- i18n implementato con dizionari statici e un Context — nessuna dipendenza esterna
- Persistenza tramite `localStorage` — nessun backend

---

## Avvio in locale

```bash
npm install
npm run dev
```

L'app sarà disponibile su [http://localhost:5173](http://localhost:5173).

```bash
npm run build    # build di produzione in dist/
npm run preview  # anteprima della build di produzione
```
