import type List from "@/components/List/model/List";
import type {
  SearchFieldRenderComponent,
  SearchShape,
  SearchValue,
} from "@/components/List/model/search/types";

export class Search<T> {
  public readonly list: List<T>;
  public readonly render?: SearchFieldRenderComponent;
  public readonly textFieldProps: SearchShape<T>["textFieldProps"];
  private onUpdateCallbacks = new Set<() => unknown>();

  public constructor(list: List<T>, searchShape: SearchShape<T>) {
    this.list = list;
    this.render = searchShape.render;
    this.textFieldProps = searchShape.textFieldProps;
  }

  public get value(): SearchValue {
    return this.list.reactTable.searchString;
  }

  public get isSet() {
    return this.value !== undefined;
  }

  public setValue(value: SearchValue): void {
    if (value === undefined || value.trim() === "") {
      this.list.reactTable.table.resetGlobalFilter();
    } else {
      this.list.reactTable.table.setGlobalFilter(value);
    }
    this.onUpdateCallbacks.forEach((cb) => cb());
  }

  public clear(): void {
    this.setValue(undefined);
  }

  public onUpdated(cb: () => unknown): void {
    this.onUpdateCallbacks.add(cb);
  }
}
