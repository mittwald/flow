import { DataLoaderSuspense } from "@/components/List/components/DataLoader/DataLoaderSuspense";
import { useList } from "@/components/List/hooks/useList";
import { Render } from "@/lib/react/components/Render";

export const DataLoader = () => {
  const loaderHooks = useList().loader.getLoaderInvocationHooks();

  return loaderHooks.map((loaderHook, i) => (
    <DataLoaderSuspense
      key={i}
      useRenderSuspense={loaderHook.useRenderSuspense}
    >
      <Render>
        {() => {
          loaderHook.useLoadBatch();
        }}
      </Render>
    </DataLoaderSuspense>
  ));
};

export default DataLoader;
