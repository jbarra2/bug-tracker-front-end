# My Sprint 5 AI workflow

**Author:** Jonathan Barragan

This writeup documents my **prompt-and-iterate** process for scaffolding the Bug Tracker front end: what I asked the agent, what came back, what I merged or discarded, and what I would change next time. It matches the Sprint 5 idea that the workflow—not line-by-line mastery of React/Next.js—is a primary learning artifact.

### Assignment scope (reminder)

Per `sprint-5.md`, the deliverable is a **single public bug-report form** that `POST`s to the team’s public **`/v1/issues`** route (no login, no triage dashboard). The UI must handle **success**, **validation errors** from the API, and **network/server failure** without blaming the user or wiping their draft. The sprint also expects practicing **AI scaffolding** against the team **OpenAPI** spec and documenting that loop.

### Prompts I used (in order)

1. **Scaffold prompt (main)**  
   *Paraphrase:* Read `sprint-5.md` and `openapi.yaml` in this repo and build the Bug Tracker front end described in the sprint doc against the API in the spec.

2. **Verification**  
   *Paraphrase:* How can I check that this works?

3. **API testing**  
   *Paraphrase:* How can I test with Postman?

4. **Quality pass**  
   *Paraphrase:* Quickly review all of the current code and make sure there are no errors?

5. **Follow-up fix**  
   *Paraphrase:* Clean up the errors that you found or find.

6. **Short confirmations**  
   Brief yes/no-style checks (e.g., whether everything looked good after cleanup, whether a set of files was safe to commit).

### What the agent produced

- **First cut:** Because the folder already contained files (e.g. `sprint-5.md`, spec), `create-next-app` in-place failed; the agent **hand-assembled** a Next.js (App Router) project: `package.json`, TypeScript/Tailwind v4/ESLint wiring, layout and landing page, `BugReportForm`, `src/lib/issues.ts` for `fetch` to `{base}/v1/issues`, and types aligned with the issue-create payload and response.
- **Smoke checks:** The agent ran **`npm run build`**, attempted **`curl`/PowerShell** POSTs to the deployed API, and discussed **CORS** risk for browser vs server-side calls.
- **Bugs in generated JSX:** Early drafts briefly introduced invalid tags (e.g. `motionless` instead of `div`) during rushed edits; those were corrected before the build was trusted.
- **Review pass:** The agent listed gaps: unused helper (`isBugReportField`), fragile mapping of API error strings to fields (spacing/casing), missing **`finally`** around submit so a thrown parse could leave “Submitting…”, and unused **`info`** styling branch for form-level messages.
- **Cleanup pass:** The agent normalized error-string matching, wrapped **201** JSON parse in **try/catch** with a user-safe server message, used **`try/finally`** to always clear submitting state, removed dead types/helpers, and simplified form banners to **error-only** styling.

### What I kept

- **Overall architecture:** One page, client form component, thin API module, shared TypeScript types—matches the sprint’s “small public form” scope.
- **User stories:** Required **title** / **description**, optional **reproduction steps** and **contact**, success confirmation with issue metadata, inline validation, and network messaging that **preserves the draft**.
- **Config pattern:** **`NEXT_PUBLIC_API_BASE_URL`** with a documented default pointing at the hosted API; **`.env.example`** so setup is reproducible.
- **Hardening from the review:** Stronger **field-error mapping**, safer **201** handling, and **submit state** cleanup—all directly tied to real failure modes.

### What I cut or corrected

- **`motionless` JSX mistakes** — discarded immediately; invalid HTML/component names.
- **Unused `isBugReportField` export** — removed as noise.
- **Unused “info” form-message pathway** — simplified to error styling only once I wasn’t using informational banners.
- **Over-trusting one failed shell smoke test** — a **`curl`** run failed due to **PowerShell quoting**, not the app; I kept the lesson, not the wrong conclusion.

### What I’d do differently next time

- **Prompt with constraints up front:** Mention non-empty repo / “manual scaffold only,” target Next version, and “no invented component names—validate build after each edit.”
- **Ask for verification earlier:** Request **`npm run lint` and `npm run build`** in the same thread as the scaffold, and one **browser-network** checklist (DevTools) alongside Postman.
- **Separate “explain” from “change”:** Use one prompt for walkthrough and a second for edits so reviews stay easier to trace in git.
- **Repo hygiene:** Prefer **`.env.example` in git** and local `.env` untracked unless the course requires otherwise; keeps diffs and reviews cleaner.
