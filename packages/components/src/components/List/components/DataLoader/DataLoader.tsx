import { useList } from "~/components/List/hooks/useList";
import React from "react";
import { Render } from "~/lib/react/components/Render";

export const DataLoader = () => {
  const loaderHooks = useList().loader.getLoaderInvocationHooks();

  return loaderHooks.map((useLoadData, i) => (
    <Render key={i}>
      {() => {
        useLoadData();
      }}
    </Render>
  ));
};

export default DataLoader;
