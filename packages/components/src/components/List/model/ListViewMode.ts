import { ListViewMode as ListViewModeState } from "@mittwald/flow-components-base";
import { useStatic } from "@/lib/hooks/useStatic";
import useSelector from "@/lib/mobx/useSelector";
import type { ListViewMode as RawListViewMode } from "./types";
import type { List } from "./List";

interface Options {
  defaultViewMode?: RawListViewMode;
  autosave?: boolean;
}

/**
 * React's view of the list's layout mode.
 *
 * The mode itself — the stored value winning over the default, the write-back —
 * is `ListViewMode` in `@mittwald/flow-components-base`. What is left here is
 * the subscription, and the fact that the model outlives a render: a view mode
 * rebuilt every render would forget what the user picked.
 */
export class ListViewMode extends ListViewModeState {
  public static useNew<T>(list: List<T>, options: Options = {}): ListViewMode {
    const viewMode = useStatic(
      () =>
        new ListViewMode({
          defaultValue: options.defaultViewMode,
          autosave:
            options.autosave ??
            list.settingsStorageDefaults?.viewMode?.autosave,
          settings: list.settingsStorage,
        }),
    );

    /* `set()` mutates an observable — without this nothing re-renders. */
    useSelector(() => viewMode.value);

    return viewMode;
  }
}
