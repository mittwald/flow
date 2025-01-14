import { useId, useLayoutEffect } from "react";
import type { ChildProps } from "~/lib/childProps/ChildPropsStore";
import { ChildPropsStore } from "~/lib/childProps/ChildPropsStore";

export const useSetChildProps = (scope: string, props: ChildProps): void => {
  const store = ChildPropsStore.useFromContext(scope);
  const id = useId();

  useLayoutEffect(() => {
    if (!store) {
      return;
    }
    store.setProps(id, props);

    return () => {
      store.removeProps(id);
    };
  }, [store, props, id]);
};
