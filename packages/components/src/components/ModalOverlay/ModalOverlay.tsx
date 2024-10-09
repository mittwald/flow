import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./ModalOverlay.module.scss";
import clsx from "clsx";
import type { OverlayController } from "@/lib/controller";
import { useOverlayController } from "@/lib/controller";
import OverlayContextProvider from "@/lib/controller/overlay/OverlayContextProvider";
import { Activity } from "@/components/Activity";

export interface ModalOverlayProps extends PropsWithChildren {
  controller?: OverlayController;
  isDismissable?: boolean;
  className?: string;
  _experimentalNoUnmountContent?: boolean;
}

export const ModalOverlay: FC<ModalOverlayProps> = (props) => {
  const {
    controller: controllerFromProps,
    children,
    isDismissable = true,
    className,
    _experimentalNoUnmountContent = false,
  } = props;

  const controllerFromContext = useOverlayController("Modal", {
    reuseControllerFromContext: true,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  const isOpen = controller.useIsOpen();

  const rootClassName = clsx(styles.overlay, className);

  const modalContent = (
    <Aria.Dialog>
      <OverlayContextProvider type="Modal" controller={controller}>
        {children}
      </OverlayContextProvider>
    </Aria.Dialog>
  );

  const portalNode = React.useMemo(
    () => (_experimentalNoUnmountContent ? createHtmlPortalNode() : null),
    [],
  );

  return (
    <>
      {portalNode && (
        <InPortal node={portalNode}>
          <Activity isActive={isOpen}>{modalContent}</Activity>
        </InPortal>
      )}
      <Aria.ModalOverlay
        className={rootClassName}
        isDismissable={isDismissable}
        isOpen={isOpen}
        onOpenChange={(isOpen) => controller.setOpen(isOpen)}
      >
        <Aria.Modal>
          {portalNode ? <OutPortal node={portalNode} /> : modalContent}
        </Aria.Modal>
      </Aria.ModalOverlay>
    </>
  );
};

export default ModalOverlay;
