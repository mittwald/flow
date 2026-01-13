import { useGridItemProps } from "@/components/List/components/Items/components/Item/hooks/useGridItemProps";
import { useList } from "@/components/List/hooks/useList";
import ItemsGridListItemView from "@/views/ItemsGridListItemView";
import type { FC, PropsWithChildren } from "react";
import { Suspense } from "react";
import type { Key } from "react-aria-components";
import styles from "./Item.module.scss";
import { ListItemSkeletonView } from "./components/ListItemSkeletonView/ListItemSkeletonView";

interface Props extends PropsWithChildren {
  id: Key;
  data: never;
}

export const Item = (props: Props) => {
  const { id, data } = props;
  const list = useList();

  const itemView = list.itemView;

  const { gridItemProps, children } = useGridItemProps(props);

  if (!itemView) {
    return null;
  }

  const textValue = itemView.textValue ? itemView.textValue(data) : undefined;
  const href = itemView.href ? itemView.href(data) : undefined;
  const hasAction = !!gridItemProps.onAction || !!href;

  return (
    <ItemsGridListItemView
      id={id}
      textValue={textValue}
      href={href}
      target={itemView.target}
      hasAction={hasAction}
      isTile={list.viewMode === "tiles"}
      {...gridItemProps}
    >
      <Suspense fallback={<ListItemSkeletonView viewMode={list.viewMode} />}>
        {children}
      </Suspense>
    </ItemsGridListItemView>
  );
};

export const ItemContainer: FC<Props> = (props) => {
  const list = useList();
  return (
    <ItemsGridListItemView
      textValue="-"
      className={styles.item}
      isTile={list.viewMode === "tiles"}
    >
      {props.children}
    </ItemsGridListItemView>
  );
};

export default Item;
