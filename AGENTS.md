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

## App architecture
- Keep shared website sections in browser-safe components and give shareable sections separate TanStack leaf routes, so navigation and page metadata remain consistent.
- Editing requests use a validated public write-only server function and private Cloud storage; visitors never receive read access to submissions or upload paths.
- Keep package and contact content in a shared browser-safe module, so selection and request summaries use one source of truth.
- Keep primary page links shared between desktop and mobile navigation, with secondary information in the footer, so navigation remains consistent.

## CI / GitHub
- The GitHub pipeline lives in `.github/workflows/ci.yml` (bun install, typecheck, tests on push/PR) so every synced change is verified on GitHub.
