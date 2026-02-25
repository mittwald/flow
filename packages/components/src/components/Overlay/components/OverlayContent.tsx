import * as Aria from "react-aria-components";
import { type FC, type PropsWithChildren, type Ref, Suspense } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import { OverlaySuspenseFallback } from "@/components/Overlay/components/OverlaySuspenseFallback";
import styles from "../Overlay.module.scss";
import DivView from "@/views/DivView";

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

  const Fallback = () => {
    return (
      <DivView className={styles.suspense}>
        <OverlaySuspenseFallback {...restProps} />
      </DivView>
    );
  };

  return (
    <Aria.ModalOverlay {...restProps} className={className}>
      <DivView>
        <Aria.Modal>
          <Suspense fallback={<Fallback />}>
            <Aria.Dialog>{children}</Aria.Dialog>
          </Suspense>
        </Aria.Modal>
      </DivView>
    </Aria.ModalOverlay>
  );
};

export default OverlayContent;
