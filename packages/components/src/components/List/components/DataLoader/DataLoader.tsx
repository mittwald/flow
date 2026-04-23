import { DataLoaderSuspense } from "@/components/List/components/DataLoader/DataLoaderSuspense";
import { useList } from "@/components/List/hooks/useList";
import { Render } from "@/lib/react/components/Render";

export const DataLoader = () => {
  const loader = useList().loader;
  const loaderHooks = loader.getLoaderInvocationHooks();
  const isInitiallyLoading = loader.useIsInitiallyLoading();

  const disableSuspense =
    loader.disableInitialSuspenseBoundary && isInitiallyLoading;

  return loaderHooks.map((loaderHook, i) => (
    <DataLoaderSuspense
      key={i}
      useRenderSuspense={loaderHook.useRenderSuspense}
      disabled={disableSuspense}
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
