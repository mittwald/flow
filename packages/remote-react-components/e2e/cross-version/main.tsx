import RemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import * as components from "@mittwald/flow-remote-react-components";
import type { VisualScenarios } from "@/tests/lib/visualScenario";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");

if (!container) {
  throw new Error("No container");
}

const modules = import.meta.glob<{ default: VisualScenarios }>(
  "../../src/tests/visual/*.scenarios.tsx",
  { eager: true },
);

const root = createRoot(container);

const url = new URL(window.location.href);
const file = url.searchParams.get("file");
const test = url.searchParams.get("test");

if (!file || !test) {
  throw new Error('Missing required query parameters "file" and "test"');
}

const scenarioModule = Object.entries(modules).find(([key]) =>
  key.endsWith(`/${file}`),
)?.[1];

if (!scenarioModule) {
  throw new Error(`Scenario module "${file}" not found`);
}

const scenario = scenarioModule.default[test];

if (!scenario) {
  throw new Error(`Scenario "${test}" not found in "${file}"`);
}

root.render(<RemoteRoot>{scenario(components)}</RemoteRoot>);
