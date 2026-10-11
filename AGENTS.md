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
- AI chat: `/chat` embeds the team's Landbot agent via iframe (URL constant in `src/routes/chat.tsx`). Why: user chose Landbot; the old Lovable AI endpoint (`src/routes/api/chat.ts`) is unused by the UI.
- Server functions must live in `src/lib/` (`*.functions.ts` / `*.server.ts`), never `src/server/`. Why: the build rejects a `src/server/` folder.
