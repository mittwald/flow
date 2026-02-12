import { useOverlayController } from "@/lib/hooks";

type UseModalControllerArgs = Parameters<typeof useOverlayController>;

export const useModalController = (options?: UseModalControllerArgs[1]) =>
  useOverlayController("Modal", options);
