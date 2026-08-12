// The `node` export condition resolves here. The shim must be the very first
// import so the DOM globals exist before any sibling module transitively pulls
// in RemoteElement (which subclasses HTMLElement). Do NOT simplify this to a
// bare `import "./shim"` or a plain `export * from "./index"`: Rollup then hoists
// the remote-dom import ahead of the shim and SSR breaks with "HTMLElement is
// not defined". Importing the shim as a used binding keeps it first.
import { domShimApplied } from "./shim";
if (!domShimApplied) {
  throw new Error("remote-core DOM shim failed to initialize");
}
export * from "./index";
