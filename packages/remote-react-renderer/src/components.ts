import { createRemoteComponentRenderer } from "@remote-dom/react/host";
import { Form } from "~/components/Form";
import { createFlowRemoteComponentRenderer } from "~/lib/createFlowRemoteComponentRenderer";
import { elementFactory } from "~/lib/elementFactory";
import autoGenerated from "./auto-generated";

const svgComponentsMap = {
  svg: createRemoteComponentRenderer(elementFactory("svg")),
  circle: createRemoteComponentRenderer(elementFactory("circle")),
  g: createRemoteComponentRenderer(elementFactory("g")),
  path: createRemoteComponentRenderer(elementFactory("path")),
} as const;

const flowComponentsMap = {
  "flr-form": createFlowRemoteComponentRenderer(Form),
};

export const components = {
  ...svgComponentsMap,
  ...flowComponentsMap,
  ...autoGenerated,
};
