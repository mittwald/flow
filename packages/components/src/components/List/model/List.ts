import { ItemCollection } from "@/components/List/model/item/ItemCollection";
import { BatchesController } from "@/components/List/model/pagination/BatchesController";
import type { RenderItemFn } from "@/components/List/model/item/Item";
import { Filter } from "./filter/Filter";
import { Sorting } from "@/components/List/model/sorting/Sorting";
import ReactTable from "@/components/List/model/ReactTable";
import type { ListShape } from "@/components/List/model/types";
import { IncrementalLoader } from "@/components/List/model/loading/IncrementalLoader";

export class List<T> {
  public readonly filters: Array<Filter<T>>;
  public readonly sorting: Array<Sorting<T>>;
  public readonly items: ItemCollection<T>;
  public readonly render?: RenderItemFn<T>;
  public readonly reactTable: ReactTable<T>;
  public readonly batches: BatchesController<T>;
  public readonly loader: IncrementalLoader<T>;

  private constructor(shape: ListShape<T>) {
    const {
      render,
      filters = [],
      sorting = [],
      batchesController,
      enableMultiSort = false,
    } = shape;

    this.render = render;

    this.items = ItemCollection.useNew(this);
    this.filters = filters.map((shape) => new Filter(this, shape));
    this.sorting = sorting.map((shape) => new Sorting<T>(this, shape));

    this.batches = new BatchesController(this, batchesController);

    this.loader = IncrementalLoader.useNew<T>(this, shape.loader);
    this.reactTable = ReactTable.useNew(this, {
      enableMultiSort,
      manualFiltering: this.loader.manualFiltering,
      manualPagination: this.loader.manualPagination,
      manualSorting: this.loader.manualSorting,
    });
  }

  public static useNew<T>(shape: ListShape<T>): List<T> {
    return new List<T>(shape);
  }

  public isFiltered(): boolean {
    return this.filters.some((f) => f.isActive());
  }
}

export default List;
