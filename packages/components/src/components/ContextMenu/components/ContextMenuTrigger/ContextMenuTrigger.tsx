import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import MenuTriggerView from "@/views/MenuTriggerView";

export type ContextMenuTriggerProps = OverlayTriggerProps;

/** @flr-generate all */
export const ContextMenuTrigger = flowComponent(
  "ContextMenuTrigger",
  (props) => {
    const { children, ...triggerProps } = props;
    return (
      <OverlayTrigger
        overlayType="ContextMenu"
        {...triggerProps}
        component={MenuTriggerView}
      >
        {children}
      </OverlayTrigger>
    );
  },
);

export default ContextMenuTrigger;
