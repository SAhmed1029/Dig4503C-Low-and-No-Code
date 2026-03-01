# Build Plan: Home Button + Background Color Changer

## Project Overview
Add two features across all 4 React app pages:
1. A **Home button** linking back to `index.html`
2. A **background color picker** so users can change the page background

Files to modify:
- `todo-list-react.html`
- `calculator-react.html`
- `weather-app-react.html`
- `image-gallery-react.html`

---

## Step 1 — Add a Home button to ONE page (todo-list)
**What:** Add a simple Home button at the top of `todo-list-react.html` that links back to `index.html`.
**How:** Add a styled `<a>` tag (not inside React) above the `#root` div, styled to match the existing purple theme.
**Test:** Open todo-list-react.html, click the Home button, confirm it takes you to index.html.

- [ ] Done

---

## Step 2 — Copy the Home button to the other 3 pages
**What:** Add the same Home button HTML/CSS to `calculator-react.html`, `weather-app-react.html`, and `image-gallery-react.html`.
**How:** Copy the same `<a>` tag and styles from Step 1 into each file. Adjust styling if needed for the calculator's dark theme.
**Test:** Open each page one at a time, click the Home button, confirm it works on all 4.

- [ ] Done

---

## Step 3 — Add a background color picker to ONE page (todo-list)
**What:** Add a small color picker UI (a `<input type="color">` with a label) to `todo-list-react.html`.
**How:** Place it near the Home button as a small toolbar. Use a few lines of vanilla JS to apply the chosen color to `document.body.style.background` when the input changes.
**Test:** Open the page, pick a color, confirm the background changes immediately.

- [ ] Done

---

## Step 4 — Copy the color picker to the other 3 pages
**What:** Add the same color picker HTML/CSS/JS to the remaining 3 pages.
**How:** Same approach as Step 3. For the calculator (dark theme), set the default color to its existing dark background.
**Test:** Open each page, change the color, confirm it works on all 4.

- [ ] Done

---

## Step 5 — Save the user's color choice with localStorage
**What:** Remember the chosen background color so it persists when the user reloads or navigates back.
**How:** On color change, save to `localStorage`. On page load, read from `localStorage` and apply the saved color. Use a shared key like `'bg-color'` across all pages.
**Test:** Pick a color, reload the page — the color should still be there. Navigate Home and back — the color should persist.

- [ ] Done

---

## Step 6 — Final review and cleanup
**What:** Walk through the full flow end-to-end.
**How:** Start at index.html, visit each app, change the background, click Home, go to another app, confirm colors persist.
**Test:** Everything works, nothing is broken, code is clean.

- [ ] Done
