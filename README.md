# Tasklane — streaming project chat

FlexiSAF deliverable 3: Streaming Chat UX and Conversational Interfaces.

Live app: https://tasklane-chat.vercel.app

This milestone extends the Tasklane board with a streaming project copilot. It preserves message history on the device, progressively renders answers, and supports stop, retry, regenerate, copy, and feedback. The model can help plan and draft, but has no board tools and cannot make task changes.

## Evidence

- [Assessment and walkthrough](docs/modules/03/assessment.md)
- [Implementation plan](docs/modules/03/plan.md)
- [Verification record](docs/modules/03/verification.md)
- [Streaming server route](src/app/api/chat/route.ts)
- [Accessible chat UI](src/components/chat.tsx)
- [Shared task types](src/types/task.ts)
- [Architecture notes](src/app/guide/page.tsx)

## Run

Node 22. Run `npm ci`, configure server-only `GROQ_API_KEY` in `.env.local`, and run `npm run dev`. `npm run typecheck` and `npm run build` validate the app. Never commit secrets or use `NEXT_PUBLIC_` for provider keys.

## Continuity

Submission 3 builds on [Tasklane submission 2](https://github.com/PenielOkoli/tasklane-02): same project identity, task list, shared types, and App Router foundation. Structured response cards and approved task tools are added in later milestones.
