import type { FC, PropsWithChildren } from "react";
import {
  overlayContext,
  useOverlayContext,
} from "@/lib/controller/overlay/context";
import type { FlowComponentName } from "@/components/propTypes";
import type { OverlayController } from "@/lib/controller";

interface Props extends PropsWithChildren {
  type: FlowComponentName;
  controller: OverlayController;
  /**
   * Whether the children are the overlay's content. Content also registers the
   * controller as the _nearest_ overlay, which is what `closeOverlay` without a
   * name resolves to. Set `false` where the subtree is not inside the overlay –
   * `OverlayTrigger` wraps the trigger too.
   *
   * @default true
   */
  isOverlayContent?: boolean;
}

export const OverlayContextProvider: FC<Props> = (props) => {
  const { type, controller, isOverlayContent = true, children } = props;
  const parentContext = useOverlayContext();

  return (
    <overlayContext.Provider
      value={{
        byType: {
          ...parentContext.byType,
          [type]: controller,
        },
        nearest: isOverlayContent ? controller : parentContext.nearest,
      }}
    >
      {children}
    </overlayContext.Provider>
  );
};

export default OverlayContextProvider;
