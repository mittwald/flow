import { readFile } from "node:fs/promises";
import path from "node:path";
import type { FC } from "react";
import { buildFlowDarkScopeCss } from "./buildFlowDarkScopeCss";

// Read at build time, so the scope follows the Flow version the docs ship with
const flowCssPath = path.join(
  process.cwd(),
  "node_modules/@mittwald/flow-react-components/dist/css/all.css",
);

/** The style behind `flowDarkScopeClass`; render it on the page that uses it */
export const FlowDarkScopeStyle: FC = async () => {
  const css = buildFlowDarkScopeCss(await readFile(flowCssPath, "utf-8"));
  return <style>{css}</style>;
};
