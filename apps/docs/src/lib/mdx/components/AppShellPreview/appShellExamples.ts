import type { ComponentType } from "react";
import FocusTask from "@/content/templates/app-shells/focus-task/examples/focus-task";
import FocusTaskBestellung from "@/content/templates/app-shells/focus-task/examples/focus-task-bestellung";
import SimpleApp from "@/content/templates/app-shells/simple-app/examples/simple-app";
import ComplexApp from "@/content/templates/app-shells/complex-app/examples/complex-app";
import ComplexAppDetail from "@/content/templates/app-shells/complex-app/examples/complex-app-detail";
import ComplexAppDoku from "@/content/templates/app-shells/complex-app/examples/complex-app-doku";

/**
 * App Shells render a real imported component so their co-located CSS module
 * resolves through Next — the react-live scope used by `LiveCodeEditor` cannot
 * handle a relative CSS import. The map is hand-maintained; add an entry per
 * shell.
 */
export const appShellExamples: Record<string, ComponentType> = {
  "focus-task": FocusTask,
  "focus-task-bestellung": FocusTaskBestellung,
  "simple-app": SimpleApp,
  "complex-app": ComplexApp,
  "complex-app-detail": ComplexAppDetail,
  "complex-app-doku": ComplexAppDoku,
};
