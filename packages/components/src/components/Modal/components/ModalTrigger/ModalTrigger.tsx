import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import type { Simplify } from "type-fest";
import DialogTriggerView from "@/views/DialogTriggerView";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export type { OverlayTriggerProps } from "@/components/OverlayTrigger";

export type ModalTriggerProps = Simplify<OverlayTriggerProps>;

export const ModalTrigger = flowComponent(
  "ModalTrigger",
  (props) => {
    const { children, ...triggerProps } = props;
    return (
      <OverlayTrigger
        overlayType="Modal"
        {...triggerProps}
        component={DialogTriggerView}
      >
        {children}
      </OverlayTrigger>
    );
  },
  { type: "provider" },
);

export default ModalTrigger;
