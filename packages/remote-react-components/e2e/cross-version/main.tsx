// Entry point for the cross-version remote document. Same shape as
// `e2e/remote-test-server/main.tsx` (routes by `?file=&test=`, resolves the
// test component from an `import.meta.glob` over the remote entries), BUT
// `RemoteRoot` is imported from the PACKAGE SPECIFIER
// `@mittwald/flow-remote-react-components/RemoteRoot` so the version alias in
// `vite.config.ts` applies and the OLD version's RemoteRoot is used — not this
// package's `src`.
import RemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import { createElement } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");

if (!container) {
  throw new Error("No container");
}

const basePath = "./tests";
const modules = import.meta.glob("./tests/**/*.browser.test.remote.tsx", {
  eager: true,
});

const root = createRoot(container);

const url = new URL(window.location.href);
const file = url.searchParams.get("file");
const test = url.searchParams.get("test");

if (!file || !test) {
  throw new Error("Invalid params");
}

const foundFile = Object.entries(modules).find(([key]) =>
  file.includes(key.slice(basePath.length)),
)?.[0];

if (!foundFile) {
  throw new Error(`File "${file}" not found`);
}

const module = modules[foundFile] as Record<string, () => JSX.Element>;
const TestComponent = module[test];

if (!TestComponent) {
  throw new Error(`Test "${test}" not found in "${file}"`);
}

root.render(<RemoteRoot>{createElement(TestComponent)}</RemoteRoot>);
