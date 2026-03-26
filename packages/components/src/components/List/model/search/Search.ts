import type List from "@/components/List/model/List";
import type {
  SearchFieldRenderComponent,
  SearchShape,
  SearchValue,
} from "@/components/List/model/search/types";
import type { InitialTableState } from "@tanstack/react-table";

export class Search<T> {
  public readonly list: List<T>;
  public readonly render?: SearchFieldRenderComponent;
  public readonly textFieldProps: SearchShape<T>["textFieldProps"];
  private onUpdateCallbacks = new Set<() => unknown>();
  private readonly initialValue?: string;
  private readonly autosave: boolean;

  public constructor(list: List<T>, searchShape: SearchShape<T>) {
    const { autosave = false, render, textFieldProps } = searchShape;

    this.autosave = autosave;
    this.list = list;
    this.render = render;
    this.textFieldProps = textFieldProps;
    this.initialValue = this.getInitialValue(searchShape);
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

  private getInitialValue(shape: SearchShape<T>) {
    return (
      this.list.settingsStorage?.get("search", { autosave: shape.autosave })
        ?.value ?? shape.defaultValue
    );
  }

  public updateInitialState(initialState: InitialTableState) {
    initialState.globalFilter = this.initialValue;
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

    this.list.settingsStorage?.store(
      "search",
      { value },
      { autosave: this.autosave },
    );
  }

  public clear(): void {
    this.setValue(undefined);
  }

  public onUpdated(cb: () => unknown): void {
    this.onUpdateCallbacks.add(cb);
  }
}
