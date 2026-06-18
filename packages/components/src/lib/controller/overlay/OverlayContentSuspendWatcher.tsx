import {
  Suspense,
  useEffect,
  useMemo,
  type FC,
  type PropsWithChildren,
} from "react";
import type { OverlayController } from "./OverlayController";

interface Props extends PropsWithChildren {
  overlayController: OverlayController;
}

const WatcherFallback: FC<Props> = (props) => {
  const { overlayController } = props;
  useEffect(() => {
    overlayController.setIsContentSuspended(true);
    return () => overlayController.setIsContentSuspended(false);
  }, [overlayController]);
  return null;
};

export const OverlayContentSuspendWatcher: FC<Props> = (props) => {
  const { overlayController, children } = props;

  const Fallback = useMemo(
    () => <WatcherFallback overlayController={overlayController} />,
    [overlayController],
  );

  return <Suspense fallback={Fallback}>{children}</Suspense>;
};
