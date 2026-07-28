import { useGridItemProps } from "@/components/List/components/Items/components/Item/hooks/useGridItemProps";
import { useList } from "@/components/List/hooks/useList";
import type ListModel from "@/components/List/model/List";
import ItemsGridListItemView from "@/views/ItemsGridListItemView";
import { mergeRefs } from "@react-aria/utils";
import type { FC, PropsWithChildren, Ref } from "react";
import { memo, Suspense } from "react";
import type { Key } from "react-aria-components";
import styles from "./Item.module.scss";
import { ListItemSkeletonView } from "./components/ListItemSkeletonView/ListItemSkeletonView";

interface Props extends PropsWithChildren {
  id: Key;
  data: never;
  triggerRef?: Ref<HTMLDivElement>;
  list: ListModel<never>;
  isTile: boolean;
}

const ItemImpl = (props: Props) => {
  const { id, data, triggerRef, list, isTile } = props;

  const itemView = list.itemView;

  const { gridItemProps, children } = useGridItemProps(props, list);

  if (!itemView) {
    return null;
  }

  const textValue = itemView.textValue ? itemView.textValue(data) : undefined;
  const href = itemView.href ? itemView.href(data) : undefined;
  const hasAction = !!gridItemProps.onAction || !!href;

  const existingRef = "ref" in gridItemProps ? gridItemProps.ref : undefined;
  const gridItemPropsWithRef = triggerRef
    ? { ...gridItemProps, ref: mergeRefs(existingRef, triggerRef) }
    : gridItemProps;

  return (
    <ItemsGridListItemView
      id={id}
      textValue={textValue}
      href={href}
      target={itemView.target}
      hasAction={hasAction}
      isTile={isTile}
      {...gridItemPropsWithRef}
    >
      <Suspense
        fallback={<ListItemSkeletonView viewMode={list.viewMode.value} />}
      >
        {children}
      </Suspense>
    </ItemsGridListItemView>
  );
};

export const Item = memo(
  ItemImpl,
  (prev, next) =>
    prev.id === next.id &&
    prev.data === next.data &&
    prev.triggerRef === next.triggerRef &&
    prev.isTile === next.isTile,
);
Item.displayName = "Item";

interface ItemContainerProps extends PropsWithChildren {
  id?: Key;
  data?: never;
}

export const ItemContainer: FC<ItemContainerProps> = (props) => {
  const list = useList();
  return (
    <ItemsGridListItemView
      textValue="-"
      className={styles.item}
      isTile={list.viewMode.isTiles}
    >
      {props.children}
    </ItemsGridListItemView>
  );
};

export default Item;
