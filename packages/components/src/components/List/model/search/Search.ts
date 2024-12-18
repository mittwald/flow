import type List from "@/components/List/model/List";
import type {
  SearchShape,
  SearchValue,
} from "@/components/List/model/search/types";
import type { InitialTableState } from "@tanstack/react-table";

export class Search<T> {
  public readonly list: List<T>;
  public readonly textFieldProps: SearchShape<T>["textFieldProps"];
  private onUpdateCallbacks = new Set<() => unknown>();
  private readonly defaultValue?: string;
  private readonly autoSubmit?: boolean;

  public constructor(list: List<T>, searchShape: SearchShape<T>) {
    this.list = list;
    this.textFieldProps = searchShape.textFieldProps;
    this.defaultValue = searchShape.defaultValue;
    this.autoSubmit = searchShape.autoSubmit;
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

  public updateInitialState(initialState: InitialTableState) {
    initialState.globalFilter = this.defaultValue;
  }

  public setValue(value: SearchValue): void {
    if (value === undefined || value.trim() === "") {
      if (this.list.reactTable.table.getState().globalFilter) {
        this.list.reactTable.table.setGlobalFilter(undefined);
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
