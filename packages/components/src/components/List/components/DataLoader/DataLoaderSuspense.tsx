import type { PropsWithChildren } from "react";
import type { FC } from "react";
import { Suspense } from "react";

interface Props extends PropsWithChildren {
  useRenderSuspense: () => void;
}

interface FallbackProps {
  useRenderSuspense: () => void;
}

const Fallback: FC<FallbackProps> = (props) => {
  const { useRenderSuspense } = props;
  useRenderSuspense();
  return null;
};

export const DataLoaderSuspense: FC<Props> = (props) => {
  const { useRenderSuspense, children } = props;
  const fallback = <Fallback useRenderSuspense={useRenderSuspense} />;
  return <Suspense fallback={fallback}>{children}</Suspense>;
};
