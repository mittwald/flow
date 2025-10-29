import type { HTMLAttributeAnchorTarget, ReactElement, ReactNode } from "react";
import { createElement } from "react";
import type { RenderItemFn } from "@/components/List/model/item/types";
import type List from "@/components/List/model/List";

export interface ItemViewShape<T> {
  textValue?: (data: T) => string;
  href?: (data: T) => string;
  target?: HTMLAttributeAnchorTarget;
  defaultExpanded?: (data: T) => boolean;
  renderFn?: RenderItemFn<T>;
  fallback?: ReactElement;
  showList?: boolean;
  showTiles?: boolean;
  tileMaxWidth?: number;
}

export class ItemView<T> {
  public readonly list: List<T>;
  public readonly textValue?: (data: T) => string;
  public readonly href?: (data: T) => string;
  public readonly target?: HTMLAttributeAnchorTarget;
  public readonly defaultExpanded?: (data: T) => boolean;
  public readonly fallback?: ReactElement;
  public readonly showTiles?: boolean;
  public readonly showList?: boolean;
  public readonly tileMaxWidth: number;
  private readonly renderFn?: RenderItemFn<T>;

  public constructor(list: List<T>, shape: ItemViewShape<T> = {}) {
    const {
      fallback,
      textValue,
      href,
      target,
      defaultExpanded,
      renderFn,
      showTiles,
      showList = true,
      tileMaxWidth = 230,
    } = shape;
    this.list = list;
    this.textValue = textValue;
    this.renderFn = renderFn;
    this.href = href;
    this.target = target;
    this.defaultExpanded = defaultExpanded;
    this.fallback = fallback;
    this.showTiles = showTiles;
    this.showList = showList;
    this.tileMaxWidth = tileMaxWidth;
  }

  private static fallbackRenderItemFn: RenderItemFn<never> = (item) =>
    createElement("pre", undefined, JSON.stringify(item));

  public render(data: T): ReactNode {
    const renderFn = (this.renderFn ??
      ItemView.fallbackRenderItemFn) as RenderItemFn<T>;
    return renderFn(data as never, this.list);
  }
}
