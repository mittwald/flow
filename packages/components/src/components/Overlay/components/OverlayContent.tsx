import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren, Ref } from "react";
import { Suspense, useLayoutEffect, useState } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import { OverlaySuspenseFallback } from "@/components/Overlay/components/OverlaySuspenseFallback";
import styles from "../Overlay.module.scss";

export interface OverlayContentProps
  extends PropsWithChildren, PropsWithClassName {
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
    return (
      <div className={styles.suspense}>
        <OverlaySuspenseFallback {...restProps} />
      </div>
    );
  };

  const rootClassName = isSuspended ? styles.overlay : className;

  return (
    <Aria.ModalOverlay {...restProps} className={rootClassName}>
      <Suspense
        fallback={
          <Aria.Modal className={styles.suspense}>
            <Fallback />
          </Aria.Modal>
        }
      >
        <Aria.Modal>
          <Aria.Dialog>{children}</Aria.Dialog>
        </Aria.Modal>
      </Suspense>
    </Aria.ModalOverlay>
  );
};

export default OverlayContent;
