<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- AI chat: streaming endpoint at `src/routes/api/chat.ts` delegating to `src/lib/chat.server.ts`; Lovable AI Gateway via `@ai-sdk/openai` Responses API, run-ID helpers in `src/lib/run-id.ts`. Why: keeps `LOVABLE_API_KEY` and the system prompt server-side; the chat UI (`src/routes/chat.tsx`) uses `useChat` + `DefaultChatTransport` and AI Elements primitives.
- Chat history is browser localStorage only (key `rawkiz-careers-chat`) — one conversation, no server persistence. Why: user choice; no accounts/database for chat.
- Server functions must live in `src/lib/` (`*.functions.ts` / `*.server.ts`), never `src/server/`. Why: the build rejects a `src/server/` folder.
