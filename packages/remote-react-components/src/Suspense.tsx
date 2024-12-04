import type { FC, PropsWithChildren, ReactNode } from "react";
import React, { Suspense as ReactSuspense, useEffect, useState } from "react";
import { Activity } from "@/Activity";
import { useIsMounted } from "@/hooks/useIsMounted";

interface Props extends PropsWithChildren {
  fallback?: ReactNode;
}

export const Suspense: FC<Props> = (props) => {
  const { children, fallback } = props;
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  const Fallback: FC = () => {
    useEffect(() => {
      setIsLoading(true);
      return () => {
        setIsLoading(false);
      };
    }, [setIsLoading]);
    return null;
  };

  return (
    <>
      <Activity isActive={!isLoading}>
        <ReactSuspense fallback={<Fallback />}>{children}</ReactSuspense>
      </Activity>
      {isLoading && fallback}
    </>
  );
};
