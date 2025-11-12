import { useContext } from "react";
import { listContext } from "../listContext";
import useSelector from "@/lib/mobx/useSelector";

export function useListMetadata<T = Record<string, unknown>>(): T | undefined {
  const { list } = useContext(listContext);
  return useSelector(
    () => list?.loader?.loaderState?.metadata as T | undefined,
    [list],
  );
}
