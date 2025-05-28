import type { OverlayTriggerProps } from "@/components/OverlayTrigger";
import { OverlayTrigger } from "@/components/OverlayTrigger";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import DialogTriggerView from "@/views/DialogTriggerView";

export type PopoverTriggerProps = OverlayTriggerProps;

export const PopoverTrigger = flowComponent("PopoverTrigger", (props) => {
  const { children, ...triggerProps } = props;
  return (
    <OverlayTrigger
      overlayType="Popover"
      {...triggerProps}
      component={DialogTriggerView}
    >
      {children}
    </OverlayTrigger>
  );
});

export default PopoverTrigger;
