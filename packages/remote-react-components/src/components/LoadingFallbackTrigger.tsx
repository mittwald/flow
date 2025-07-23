import { useRemoteContext } from "@/components/RemoteContextProvider";
import { useLayoutEffect, type FC } from "react";

export interface LoadingFallbackTriggerProps {
  show?: boolean;
}

export const LoadingFallbackTrigger: FC<LoadingFallbackTriggerProps> = (
  props,
) => {
  const { show = true } = props;
  const { connection } = useRemoteContext();
  useLayoutEffect(() => {
    connection.imports.setIsLoading(show);
    return () => {
      connection.imports.setIsLoading(false);
    };
  }, [connection, show]);
  return null;
};
