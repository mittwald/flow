import type {
  DependencyList,
  HTMLAttributeAnchorTarget,
  ReactElement,
  ReactNode,
} from "react";
import { createElement } from "react";
import type { RenderItemFn } from "@/components/List/model/item/types";
import type List from "@/components/List/model/List";
import { isShallowEqual } from "remeda";

export interface ItemViewShape<T> {
  /**
   * Runs on every render of the list to tell whether the item changed, so it
   * should be cheap and pure.
   */
  textValue?: (data: T) => string;
  /**
   * Runs on every render of the list to tell whether the item changed, so it
   * should be cheap and pure.
   */
  href?: (data: T) => string;
  target?: HTMLAttributeAnchorTarget;
  defaultExpanded?: (data: T) => boolean;
  renderFn?: RenderItemFn<T>;
  /** @deprecated Use loadingView instead */
  fallback?: ReactElement;
  loadingView?: ReactElement;
  showList?: boolean;
  showTiles?: boolean;
  tileMaxWidth?: number;
  /**
   * Everything the render function reads besides the item's data.
   *
   * With `dependencies`, an item re-renders only when its data or one of these
   * values changes. The render function's identity no longer counts, so a
   * function written inline in JSX keeps the item from re-rendering on every
   * render of its parent. List every value it reads from outside the item,
   * including state read through the `list` argument — one left out keeps the
   * item on the value it last rendered.
   *
   * Without it, an item re-renders whenever its render function changes
   * identity, which an inline function does on every render of its parent.
   */
  dependencies?: DependencyList;
}

export class ItemView<T> {
  public readonly list: List<T>;
  public readonly textValue?: (data: T) => string;
  public readonly href?: (data: T) => string;
  public readonly target?: HTMLAttributeAnchorTarget;
  public readonly defaultExpanded?: (data: T) => boolean;
  public readonly loadingView?: ReactElement;
  public readonly showTiles?: boolean;
  public readonly showList?: boolean;
  public readonly tileMaxWidth: number;
  public readonly dependencies?: DependencyList;
  private readonly renderFn?: RenderItemFn<T>;
  private lastComparison?: { other: ItemView<T>; result: boolean };

  public constructor(list: List<T>, shape: ItemViewShape<T> = {}) {
    const {
      fallback,
      loadingView = fallback,
      textValue,
      href,
      target,
      defaultExpanded,
      renderFn,
      showTiles,
      showList = true,
      tileMaxWidth = 230,
      dependencies,
    } = shape;
    this.list = list;
    this.textValue = textValue;
    this.renderFn = renderFn;
    this.href = href;
    this.target = target;
    this.defaultExpanded = defaultExpanded;
    this.loadingView = loadingView;
    this.showTiles = showTiles;
    this.showList = showList;
    this.tileMaxWidth = tileMaxWidth;
    this.dependencies = dependencies;
  }

  private static fallbackRenderItemFn: RenderItemFn<never> = (item) =>
    createElement("pre", undefined, JSON.stringify(item));

  /**
   * Whether `other` would render the item holding `data` identically. The
   * render function counts by its `dependencies` where given, otherwise by its
   * identity. `textValue` and `href` count by what they return for `data`, so
   * inline functions do not re-render the item. `defaultExpanded` is read on
   * mount only, so it does not count at all.
   */
  public rendersSameFor(other: ItemView<T> | undefined, data: T): boolean {
    return (
      !!other &&
      this.rendersSameContentAs(other) &&
      this.textValue?.(data) === other.textValue?.(data) &&
      this.href?.(data) === other.href?.(data) &&
      this.target === other.target
    );
  }

  // Every item of a render shares one item view, so the result is cached for
  // the last `other`.
  private rendersSameContentAs(other: ItemView<T>): boolean {
    if (this.lastComparison?.other !== other) {
      this.lastComparison = {
        other,
        result:
          this.dependencies || other.dependencies
            ? isShallowEqual(this.dependencies, other.dependencies)
            : this.renderFn === other.renderFn,
      };
    }
    return this.lastComparison.result;
  }

  public render(data: T): ReactNode {
    const renderFn = (this.renderFn ??
      ItemView.fallbackRenderItemFn) as RenderItemFn<T>;
    return renderFn(data as never, this.list);
  }
}
