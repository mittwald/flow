import { domShimApplied } from "./shim";

export { RemoteReceiver } from "@mittwald/remote-dom-core/receivers";
export {
  RemoteElement,
  RemoteEvent,
  type RemoteElementConstructor,
} from "@mittwald/remote-dom-core/elements";
export * from "./serialization";
export * from "./connection";
export * from "./error";
export * from "./events/remoteEvents";

// The DOM shim above must be evaluated before RemoteElement (which subclasses
// HTMLElement) is imported. Referencing the binding keeps the import from being
// tree-shaken or reordered after the remote-dom re-export.
if (!domShimApplied) {
  throw new Error("remote-core DOM shim failed to initialize");
}
