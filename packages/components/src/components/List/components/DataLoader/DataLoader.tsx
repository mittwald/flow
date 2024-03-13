import { useList } from "@/components/List/hooks/useList";
import React, { Suspense } from "react";
import { Render } from "@/lib/react/components/Render";

export const DataLoader = () => {
  const loaderHooks = useList().loader.getLoaderInvocationHooks();

  return loaderHooks.map((useLoadData, i) => (
    <Suspense key={i}>
      <Render>
        {() => {
          useLoadData();
        }}
      </Render>
    </Suspense>
  ));
};

export default DataLoader;
