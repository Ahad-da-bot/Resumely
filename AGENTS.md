# Resumely Project Rules & Guidelines

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (standard utility classes)
- **UI Components:** Shadcn UI
- **Backend / Auth:** Supabase (`@supabase/ssr`)
- **State Management:** Zustand
- **Form Management:** React Hook Form + Zod (`@hookform/resolvers/zod`)
- **PDF Generation:** `@react-pdf/renderer`
- **AI Integration:** Vercel AI SDK (`ai`, `@ai-sdk/google`)

## Architecture & Code Standards
1. **Strict Typing:** Never use `any`. Always define Zod schemas for forms and data structures, inferring TypeScript types directly from them using `z.infer<typeof schema>`.
2. **Components:** Always use Shadcn UI components for the interface. Do not write raw HTML `<button>` or `<input>` tags.
3. **Authentication:** Use `@supabase/ssr` for all auth flows.
   - Server Components must use the server client.
   - Client Components must use the browser client.
4. **State Management:** Use Zustand stores for global state (such as syncing the resume editor form live with the PDF preview). Do not use React Context for global application state.
5. **Styling:** Use standard Tailwind utility classes cleanly and consistently.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
