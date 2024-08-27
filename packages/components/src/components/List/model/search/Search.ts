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

  private callOnUpdateCallbacks(): void {
    this.onUpdateCallbacks.forEach((cb) => cb());
  }

  public setValue(value: SearchValue): void {
    if (value === undefined || value.trim() === "") {
      if (this.list.reactTable.table.getState().globalFilter) {
        this.list.reactTable.table.resetGlobalFilter();
        this.callOnUpdateCallbacks();
      }
    } else {
      this.list.reactTable.table.setGlobalFilter(value);
      this.callOnUpdateCallbacks();
    }
  }

  public clear(): void {
    this.setValue(undefined);
  }

  public onUpdated(cb: () => unknown): void {
    this.onUpdateCallbacks.add(cb);
  }
}
