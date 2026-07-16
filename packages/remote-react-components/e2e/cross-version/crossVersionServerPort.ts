/**
 * Ports the cross-version remote test servers listen on. Kept in their own
 * zero-import module so both the server lifecycle (`createServer.tsx`, Node
 * side) and the host-side browser test (browser bundle) can import just the
 * number without pulling `vite` — a Node-only dependency whose transitive
 * `fsevents` native binary esbuild cannot bundle for a browser target — into
 * the browser build.
 *
 * Both are distinct from the plain e2e remote test server (6022).
 */
export const currentServerPort = 6098;
export const oldServerPort = 6099;
