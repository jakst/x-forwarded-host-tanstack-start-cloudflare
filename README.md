This is a reproduction to show how `@cloudflare/vite-plugin` rewrites host headers.

To start:

1. Clone the repo and install dependencies with `pnpm install`
2. Launch the dev server in one terminal with `pnpm dev` and the proxy in another terminal with `pnpm proxy`.
3. Visit the app directly on http://localhost:3000 and through the proxy on http://localhost:4000 (you can switch between them through a link in the app).
4. Notice that the host checks do not pass
5. Remove the cloudflare plugin from vite.config.ts and restart the dev server
6. Check the app again, and notice that all checks pass.
