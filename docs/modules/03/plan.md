# Tasklane — deliverable 3 plan

## Acceptance criteria

- The project board and typed task model continue from submission 2.
- A streamed chat view progressively renders server-generated text.
- User, assistant, progress, stopped, and error states are distinguishable.
- Users can stop, retry, regenerate, copy, and rate an assistant reply.
- Conversation history persists locally and can be cleared.
- Keyboard send behavior and polite screen reader status updates are present.
- Request size, shape, origin, and sensitive credential patterns are checked on the server.
- Provider and safety errors preserve the conversation and show a clear fallback.
- The GitHub repository is connected to a separate Vercel project.

## Boundaries

The model can discuss project planning and draft text, but has no tools and cannot change board tasks in this milestone. Conversations are stored in the browser's local storage. Only the latest eight messages accompany a request. The model key stays in the server environment.
