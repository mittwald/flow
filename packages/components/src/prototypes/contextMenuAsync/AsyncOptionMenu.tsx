import { useRef, useState, type FC } from "react";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { ContextMenuContent } from "@/components/ContextMenu";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MenuItem } from "@/components/MenuItem";
import { Popover } from "@/components/Popover/Popover";
import { SearchField } from "@/components/SearchField";
import { Separator } from "@/components/Separator";
import { Text } from "@/components/Text";
import { useOverlayController } from "@/lib/controller";
import { mergeSelection, resolveSelection } from "./lib/selection";
import {
  useAsyncOptions,
  type AsyncOption,
  type AsyncOptionLoader,
} from "./lib/useAsyncOptions";

/**
 * How an option that is selected but absent from the current page / filter is
 * treated. **This is the open UX question** (issue #1851): both variants keep
 * the selection itself intact — they differ only in what the user sees.
 *
 * - `pin` — selected options are always rendered, in their own group above the
 *   results. What GitHub's label picker does. The user can always undo a
 *   selection, but the group competes with the search results for space.
 * - `inline` — selected options appear only when the current page or filter
 *   contains them. Quieter, but a selection can be invisible while the user
 *   searches, which reads as "it got lost" even though it did not.
 */
export type SelectedOptionBehavior = "pin" | "inline";

export interface AsyncOptionMenuProps {
  /** Label of the trigger button. */
  label: string;
  /** Loads one page of options for the current search term. */
  load: AsyncOptionLoader;
  /** Debounce before a changed search term triggers a load. @default 250 */
  debounceMs?: number;
  /** @default "pin" */
  selectedOptionBehavior?: SelectedOptionBehavior;
  /** Selected keys. Uncontrolled if omitted. */
  selectedKeys?: ReadonlySet<Aria.Key>;
  onSelectionChange?: (keys: ReadonlySet<Aria.Key>) => void;
}

const EMPTY: ReadonlySet<Aria.Key> = new Set<Aria.Key>();

/**
 * PROTOTYPE — searchable, async-loaded, multi-select option menu (issue #1851).
 *
 * Not exported from `public.ts` and not `@flr-generate`d: the interaction and
 * visual design belong to UX, and the remote-capable shape belongs to a
 * follow-up. This exists to prove the mechanics and to give UX something to
 * react to.
 *
 * The three challenges from the issue map onto three specific places:
 *
 * 1. **Selection surviving a filter** — `mergeSelection` below. Measured result:
 *    react-aria 1.20 already preserves a selected key whose option is not in
 *    the current collection, so this is not a workaround for a bug. It pins the
 *    behaviour we depend on (the browser test fails if it ever regresses) and
 *    resolves the `"all"` wildcard, which _is_ collection-bound.
 * 2. **Selection surviving async loading** — `selectedKeys` lives here, above
 *    `useAsyncOptions`, and the loader never sees it. `optionCache` keeps the
 *    _label_ of a selected option so it stays renderable after the page that
 *    introduced it is gone.
 * 3. **Performance** — the collection only ever holds one page plus the pinned
 *    selection, so filtering is the server's job, not a client-side pass over
 *    everything. See the PR body for where the remaining ceiling sits.
 */
export const AsyncOptionMenu: FC<AsyncOptionMenuProps> = (props) => {
  const {
    label,
    load,
    debounceMs,
    selectedOptionBehavior = "pin",
    selectedKeys: selectedKeysFromProps,
    onSelectionChange,
  } = props;

  const controller = useOverlayController("Popover", {
    reuseControllerFromContext: false,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [search, setSearch] = useState("");
  const [uncontrolledSelection, setUncontrolledSelection] =
    useState<ReadonlySet<Aria.Key>>(EMPTY);

  const selectedKeys = selectedKeysFromProps ?? uncontrolledSelection;

  const { options, loadingState, hasMore, loadMore } = useAsyncOptions(
    load,
    search,
    { debounceMs },
  );

  /*
   * Labels of options the user has selected at some point. A selected option
   * whose page is gone (search changed, or it was never on the first page) has
   * no data left to render from — this is the only reason the cache exists, and
   * it is why the selection can be *shown*, not just held.
   */
  const optionCache = useRef(new Map<Aria.Key, AsyncOption>());
  for (const option of options) {
    optionCache.current.set(option.id, option);
  }

  /*
   * Not memoized: it reads `optionCache`, a ref that the loop above mutates
   * during render, so a dependency array cannot describe when it changes. The
   * work is one lookup per selected key.
   */
  const pinnedOptions =
    selectedOptionBehavior === "pin"
      ? [...selectedKeys].flatMap((key) => {
          const option = optionCache.current.get(key);
          return option ? [option] : [];
        })
      : [];

  const pinnedKeys = new Set(pinnedOptions.map((option) => option.id));
  const listedOptions = options.filter((option) => !pinnedKeys.has(option.id));

  /*
   * Exactly the keys the collection renders right now — the reference
   * `mergeSelection` needs to tell "the user unchecked this" apart from "this
   * is not on screen".
   */
  const visibleKeys = new Set<Aria.Key>([
    ...pinnedOptions.map((option) => option.id),
    ...listedOptions.map((option) => option.id),
  ]);

  const handleSelectionChange = (selection: Aria.Selection) => {
    const merged = mergeSelection({
      previous: selectedKeys,
      next: resolveSelection(selection, visibleKeys),
      visibleKeys,
    });

    setUncontrolledSelection(merged);
    onSelectionChange?.(merged);
  };

  const renderOption = (option: AsyncOption) => (
    <MenuItem id={option.id} key={option.id} selectionVariant="control">
      <Text>{option.label}</Text>
    </MenuItem>
  );

  const isInitiallyLoading = loadingState === "loading";

  return (
    <>
      <Button ref={triggerRef} onPress={() => controller.open()}>
        {label}
        {selectedKeys.size > 0 ? ` (${selectedKeys.size})` : ""}
      </Button>
      <Popover
        controller={controller}
        triggerRef={triggerRef}
        placement="bottom start"
        width={320}
        maxHeight={360}
        isNonModal
      >
        <Aria.Autocomplete
          inputValue={search}
          onInputChange={setSearch}
          disableAutoFocusFirst
        >
          <SearchField autoFocus />
          <ContextMenuContent
            selectionMode="multiple"
            selectedKeys={selectedKeys as Set<Aria.Key>}
            onSelectionChange={handleSelectionChange}
            renderEmptyState={() => (
              <Text>
                {isInitiallyLoading ? <LoadingSpinner /> : "No options found"}
              </Text>
            )}
          >
            {pinnedOptions.map(renderOption)}
            {pinnedOptions.length > 0 && listedOptions.length > 0 ? (
              <Separator />
            ) : null}
            {listedOptions.map(renderOption)}
          </ContextMenuContent>
        </Aria.Autocomplete>
        {loadingState === "loadingMore" ? (
          <Text>
            <LoadingSpinner />
          </Text>
        ) : hasMore && !isInitiallyLoading ? (
          <Button onPress={loadMore} variant="soft" color="secondary">
            Load more
          </Button>
        ) : null}
      </Popover>
    </>
  );
};

export default AsyncOptionMenu;
