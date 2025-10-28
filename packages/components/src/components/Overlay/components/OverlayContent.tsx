import * as Aria from "react-aria-components";
import type { FC, PropsWithChildren, Ref } from "react";
import { Suspense } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import LoadingSpinnerView from "@/views/LoadingSpinnerView";
import { useAriaAnnounceSuspense } from "@/components/Action/lib/ariaLive";

export interface OverlayContentProps
  extends PropsWithChildren,
    PropsWithClassName {
  ref?: Ref<HTMLDivElement>;
  onOpenChange: (isOpen: boolean) => void;
  isDismissable?: boolean;
  isOpen?: boolean;
}

const OverlaySuspenseFallback: FC = () => {
  useAriaAnnounceSuspense();
  return <LoadingSpinnerView color="dark" />;
};

/** @flr-generate all */
export const OverlayContent: FC<OverlayContentProps> = (props) => {
  const { children, ...restProps } = props;

  return (
    <Aria.ModalOverlay {...restProps}>
      <Suspense fallback={<OverlaySuspenseFallback />}>
        <Aria.Modal>
          <Aria.Dialog>{children}</Aria.Dialog>
        </Aria.Modal>
      </Suspense>
    </Aria.ModalOverlay>
  );
};

export default OverlayContent;
