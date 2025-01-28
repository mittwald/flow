import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren, Ref } from "react";
import React from "react";
import type { PropsWithClassName } from "~/lib/types/props";

export interface OverlayContentProps
  extends PropsWithChildren,
    PropsWithClassName {
  ref?: Ref<HTMLDivElement>;
  onOpenChange: (isOpen: boolean) => void;
  isDismissable?: boolean;
  isOpen?: boolean;
}

/** @flr-generate all */
export const OverlayContent: FC<OverlayContentProps> = (props) => {
  const { children, ...restProps } = props;

  return (
    <Aria.ModalOverlay {...restProps}>
      <Aria.Modal>
        <Aria.Dialog>{children}</Aria.Dialog>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
};

export default OverlayContent;
