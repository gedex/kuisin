# Kuisin

Kuisin is a static React app for quizzes and flashcards. Quiz data lives in JSON files that can be hosted with the app, starting with GitHub Pages.

## Stack

- React + Vite
- TanStack Router
- TanStack Query
- Static JSON data in `public/kuis`
- Device-local progress in `localStorage`

## Quick Start

```bash
nvm use
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Quiz Data

The quiz index is at:

```text
public/kuis/index.json
```

Each quiz uses a matching slug file:

```text
/kuis/ujian-besok -> public/kuis/ujian-besok.json
```

Single-question quizzes can use routed pagination:

```json
{
  "settings": {
    "questionMode": "single"
  }
}
```

Then questions are linkable with `?soal=1`, `?soal=2`, etc.

Question renderers are selected per question, so mixed quizzes can combine question types:

```json
{
  "id": "q1",
  "type": "multiple-choice",
  "prompt": "Berapa hasil 8 x 7?"
}
```

Supported question types:

- `multiple-choice`: `choices` + answer choice id
- `true-false`: boolean `answer`
- `short-answer`: accepted `answers` array
