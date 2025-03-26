import RemoteRoot from "@/components/RemoteRoot";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");

if (!container) {
  throw new Error("No container");
}

const modules = import.meta.glob("/**/*.browser.test.remote.tsx");

const root = createRoot(container);
const url = new URL(window.location.href);
const file = url.searchParams.get("file");
const test = url.searchParams.get("test");

if (!file || !test) {
  throw new Error("Invalid params");
}

const module = modules[file];

if (!module) {
  throw new Error("Invalid params");
}

const moduleContent = (await module()) as Record<string, ReactNode>;
const testContent = moduleContent[test];

root.render(<RemoteRoot disableExtBridge>{testContent}</RemoteRoot>);
