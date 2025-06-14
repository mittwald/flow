import RemoteRoot from "@/components/RemoteRoot";
import { createElement, type ComponentType } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");

if (!container) {
  throw new Error("No container");
}

const basePath = "../../../src/";
const modules = import.meta.glob("../../../src/**/*.browser.test.remote.tsx");

await Promise.all(Object.values(modules).map((module) => module()));

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

const module = modules[foundFile];
const moduleContent = (await module()) as Record<string, ComponentType>;
const TestComponent = moduleContent[test];

root.render(<RemoteRoot>{createElement(TestComponent)}</RemoteRoot>);
