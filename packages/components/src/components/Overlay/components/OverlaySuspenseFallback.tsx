import type { FC } from "react";
import LoadingSpinnerView from "@/views/LoadingSpinnerView";
import { useAriaAnnounceSuspense } from "@/components/Action/lib/ariaLive";
import { type OverlayContentProps } from "@/index/default";

export const OverlaySuspenseFallback: FC<OverlayContentProps> = () => {
  useAriaAnnounceSuspense();
  return <LoadingSpinnerView color="dark" />;
};
