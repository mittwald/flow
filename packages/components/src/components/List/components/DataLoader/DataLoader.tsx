import { useList } from "@/components/List/hooks/useList";
import React, { Suspense } from "react";
import { Render } from "@/lib/react/components/Render";
import { SuspenseFallback } from "@/components/List/components/DataLoader/components/SuspenseFallback";

export const DataLoader = () => {
  const loaderHooks = useList().loader.getLoaderInvocationHooks();

  return loaderHooks.map((useLoadData, i) => (
    <Suspense key={i} fallback={<SuspenseFallback pageIndex={i} />}>
      <Render>
        {() => {
          useLoadData();
        }}
      </Render>
    </Suspense>
  ));
};

export default DataLoader;
