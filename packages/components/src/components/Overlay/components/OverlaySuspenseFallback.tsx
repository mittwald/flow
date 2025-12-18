import type { FC } from "react";
import LoadingSpinnerView from "@/views/LoadingSpinnerView";
import { useAriaAnnounceSuspense } from "@/components/Action/lib/ariaLive";
import type { OverlayContentProps } from "@/components/Overlay/components/OverlayContent";

export const OverlaySuspenseFallback: FC<OverlayContentProps> = () => {
  useAriaAnnounceSuspense();
  return <LoadingSpinnerView color="dark" />;
};
