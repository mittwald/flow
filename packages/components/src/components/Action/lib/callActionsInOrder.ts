import { ActionFn } from "@/components/Action";

export const callActionsInOrder = (
  args: unknown[],
  actions: Array<ActionFn | undefined>,
): unknown => {
  const actionsCopy = [...actions];

  let action: ActionFn | undefined;

  while (actionsCopy.length > 0) {
    action = actionsCopy.shift();
    if (action) {
      const result = action(...args);
      if (result instanceof Promise) {
        return result.then(() => callActionsInOrder(args, actionsCopy));
      }
    }
  }
};
