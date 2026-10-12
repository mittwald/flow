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
 * rebuilt every render would forget what the user picked. The list, its
 * settings store and `autosave` are taken from the current render, as they were
 * when this class was rebuilt with the list.
 */
export class ListViewMode<T = unknown> extends ListViewModeState {
  private currentList: List<T>;

  private constructor(list: List<T>, options: Options) {
    super({
      defaultValue: options.defaultViewMode,
      ...ListViewMode.storageOf(list, options),
    });
    this.currentList = list;
  }

  public get list(): List<T> {
    return this.currentList;
  }

  private static storageOf<T>(list: List<T>, options: Options) {
    return {
      autosave:
        options.autosave ?? list.settingsStorageDefaults?.viewMode?.autosave,
      settings: list.settingsStorage,
    };
  }

  public static useNew<T>(
    list: List<T>,
    options: Options = {},
  ): ListViewMode<T> {
    const viewMode = useStatic(() => new ListViewMode<T>(list, options));
    viewMode.currentList = list;
    viewMode.updateStorage(ListViewMode.storageOf(list, options));

    /* `set()` mutates an observable — without this nothing re-renders. */
    useSelector(() => viewMode.value);

    return viewMode;
  }
}
