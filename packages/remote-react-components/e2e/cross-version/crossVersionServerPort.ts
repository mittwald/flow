/**
 * Port the cross-version remote test server listens on. Kept in its own
 * zero-import module so both the server lifecycle (`createServer.tsx`, Node
 * side) and the host-side browser test (browser bundle) can import just the
 * number without pulling `vite` — a Node-only dependency whose transitive
 * `fsevents` native binary esbuild cannot bundle for a browser target — into
 * the browser build.
 *
 * Distinct from the plain e2e remote test server (6022) so both can run
 * simultaneously without a port clash.
 */
export const crossVersionServerPort = 6099;
