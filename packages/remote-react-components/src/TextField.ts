import { RemoteTextFieldElement } from "@mittwald/flow-remote-elements";
import createFlowRemoteComponent from "@/lib/createFlowRemoteComponent";

export const TextField = createFlowRemoteComponent(
  "flr-text-field",
  "TextField",
  RemoteTextFieldElement,
  {
    eventProps: {
      onChange: { event: "change" } as never,
      onBlur: { event: "blur" } as never,
      onFocus: { event: "focus" } as never,
    },
  },
);

export default TextField;
