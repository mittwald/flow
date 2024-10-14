import { createFlowRemoteComponentsRenderer } from "@/lib/createFlowRemoteComponentsRenderer";
import type { RemoteComponentsMap } from "@/lib/types";
import type { FlowRemoteRhfElementKeys } from "@mittwald/flow-remote-elements/react-hook-form";
import { Form } from "@mittwald/flow-react-components/react-hook-form";

export const components: RemoteComponentsMap<FlowRemoteRhfElementKeys> = {
  "flr.rhf-form": createFlowRemoteComponentsRenderer(Form as never),
};
