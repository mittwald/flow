import { useAriaAnnounceSuspense } from "@/index/default";
import FlexView from "@/views/FlexView";
import LoadingSpinnerView from "@/views/LoadingSpinnerView";
import type { FC } from "react";

export const OffCanvasSuspenseFallback: FC = () => {
  useAriaAnnounceSuspense();
  return (
    <FlexView grow align="center" justify="center">
      <LoadingSpinnerView />
    </FlexView>
  );
};
