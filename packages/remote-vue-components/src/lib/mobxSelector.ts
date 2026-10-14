import { autorun } from "mobx";
import { getCurrentScope, onScopeDispose, shallowRef, type Ref } from "vue";

/**
 * Reads a MobX value as a Vue ref.
 *
 * The counterpart of `useSelector` in `@mittwald/flow-react-components`: the
 * state in `@mittwald/flow-components-base` is MobX and knows no framework, so
 * each binding brings its own subscription. This is that subscription, and it
 * is the whole of it — twelve lines against a shared model.
 *
 * `shallowRef`, because what MobX hands back is already the value to render;
 * making Vue walk into it would only cost a proxy and could fight MobX's own.
 */
export const watchMobxValue = <T>(select: () => T): Readonly<Ref<T>> => {
  const value = shallowRef<T>() as Ref<T>;

  /* `autorun` runs its effect immediately, so the ref has a value on return. */
  const stop = autorun(() => {
    value.value = select();
  });

  /*
   * A scope is required rather than optional: without one nothing would ever
   * stop the `autorun`, and the ref would keep a disposed component's render
   * alive with no way for the caller to intervene — it is handed a ref, not a
   * stopper. `setup()` is a scope, and so is an explicit `effectScope()`.
   */
  if (!getCurrentScope()) {
    stop();
    throw new Error(
      "watchMobxValue() must be called inside a component setup or an effectScope().",
    );
  }

  onScopeDispose(stop);

  return value;
};

export default watchMobxValue;
