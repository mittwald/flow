import useSelector from "@/lib/mobx/useSelector";
import { useList } from "@/components/List/hooks/useList";

export function useListMetadata<T = unknown>(): T | undefined {
  const list = useList();
  return useSelector(
    () => list?.loader?.loaderState?.metadata as T | undefined,
    [list],
  );
}
