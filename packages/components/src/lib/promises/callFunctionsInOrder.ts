type Fn = (...args: unknown[]) => unknown;

export const callFunctionsInOrder =
  (actions: Array<Fn | undefined>) =>
  (...args: unknown[]): unknown => {
    const actionsCopy = [...actions];

    const action = actionsCopy.shift();

    if (action) {
      const result = action(...args);

      const recurse = () => {
        if (actionsCopy.length === 0) {
          return result;
        } else {
          return callFunctionsInOrder(actionsCopy)(...args);
        }
      };

      if (result instanceof Promise) {
        return result.then(recurse);
      } else {
        return recurse();
      }
    }
  };
