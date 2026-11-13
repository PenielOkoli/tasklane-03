# Deliverable 3 assessment mapping

| Requirement | Evidence |
|---|---|
| User and assistant messages | `src/components/chat.tsx` |
| Progressive streaming | `/api/chat` streams text; the client reads and appends chunks |
| Loading, stop, retry, regenerate | Chat composer and per-message controls |
| Copy and feedback | Assistant message actions |
| Local conversation history | Bounded localStorage history and clear control |
| Accessible keyboard and status | Enter/Shift+Enter behavior, labels, focusable controls, `role=status` live region |
| Failure and safety fallback | API safe errors, sensitive credential guard, retained partial response |
| Server-side integration | `src/app/api/chat/route.ts`; Groq key never enters client code |

## Reviewer walkthrough

Open `/copilot`, send a project question, and observe text arriving progressively. Stop a response and verify its partial text remains; retry or regenerate. Copy an answer, give feedback, refresh to confirm local history, then clear the conversation. Try a message containing an API-key-shaped string and confirm the server blocks it with a safety message.
