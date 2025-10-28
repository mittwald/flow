import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren, Ref } from "react";
import { Suspense, useLayoutEffect, useState } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import { OverlaySuspenseFallback } from "@/components/Overlay/components/OverlaySuspenseFallback";
import styles from "../Overlay.module.scss";

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
  const { children, className, ...restProps } = props;

  const [isSuspended, setIsSuspended] = useState(false);

  const Fallback = () => {
    // Track suspense state to adjust styling
    useLayoutEffect(() => {
      setIsSuspended(true);
      return () => setIsSuspended(false);
    }, [setIsSuspended]);
    return <OverlaySuspenseFallback {...restProps} />;
  };

  const rootClassName = isSuspended ? styles.overlay : className;

  return (
    <Aria.ModalOverlay {...restProps} className={rootClassName}>
      <Aria.Modal>
        <Suspense fallback={<Fallback />}>
          <Aria.Dialog>{children}</Aria.Dialog>
        </Suspense>
      </Aria.Modal>
    </Aria.ModalOverlay>
  );
};

export default OverlayContent;
