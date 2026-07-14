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

## Deploy to GitHub Pages

The `trunk` branch deploys to GitHub Pages through GitHub Actions. The
production build uses `/` as the Vite base path, matching the custom domain:

```text
https://kuisin.id/
```

To deploy:

1. Push changes to `trunk`.
2. In GitHub, open **Settings -> Pages**.
3. Set **Build and deployment -> Source** to **GitHub Actions**.
4. Set **Custom domain** to `kuisin.id`.
5. Open **Actions -> Deploy to GitHub Pages** and wait for the workflow to
   finish.

Configure the custom-domain DNS records using the
[GitHub Pages custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

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
    "questionMode": "single",
    "requireAnswerBeforeNext": true,
    "disableQuestionNavigation": true
  }
}
```

Then questions are linkable with `?soal=1`, `?soal=2`, etc. Set
`requireAnswerBeforeNext` to `true` to keep the next button disabled until the
current question has an answer. Set `disableQuestionNavigation` to `true` to
hide previous/next buttons and move to the next question after an answer.

Question renderers are selected per question, so mixed quizzes can combine question types:

```json
{
  "id": "q1",
  "type": "short-answer",
  "prompt": "Berapa hasil 8 x 7?",
  "inputType": "number",
  "answers": ["56"]
}
```

Supported question types:

- `multiple-choice`: `choices` + answer choice id
- `true-false`: boolean `answer`
- `short-answer`: accepted `answers` array, optional `inputType` for the answer field
