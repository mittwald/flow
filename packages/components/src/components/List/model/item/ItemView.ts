import type {
  DependencyList,
  HTMLAttributeAnchorTarget,
  ReactElement,
  ReactNode,
} from "react";
import { createElement } from "react";
import type { RenderItemFn } from "@/components/List/model/item/types";
import type List from "@/components/List/model/List";

export interface ItemViewShape<T> {
  textValue?: (data: T) => string;
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
   * Values this item's content depends on besides its own data.
   *
   * An item re-renders when its data changes, or when one of the render
   * functions on its `List.Item` changes identity — which a function written
   * inline in JSX does on every render of its parent. A render function with a
   * stable identity (hoisted out of the component, wrapped in `useCallback`, or
   * reading from an external store) has to list what it reads here, or the item
   * keeps the values it first saw.
   */
  dependencies?: DependencyList;
}

const dependenciesAreEqual = (a?: DependencyList, b?: DependencyList) =>
  a === b ||
  (!!a &&
    !!b &&
    a.length === b.length &&
    a.every((dependency, index) => Object.is(dependency, b[index])));

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
   * Whether `other` would render this item identically — i.e. all render
   * functions taken from the consumer's `ListItem` element are still the same,
   * and the dependencies it declared have not changed.
   */
  public rendersSameAs(other?: ItemView<T>): boolean {
    return (
      !!other &&
      dependenciesAreEqual(this.dependencies, other.dependencies) &&
      this.renderFn === other.renderFn &&
      this.textValue === other.textValue &&
      this.href === other.href &&
      this.target === other.target &&
      this.defaultExpanded === other.defaultExpanded
    );
  }

  public render(data: T): ReactNode {
    const renderFn = (this.renderFn ??
      ItemView.fallbackRenderItemFn) as RenderItemFn<T>;
    return renderFn(data as never, this.list);
  }
}
