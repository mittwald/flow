import { useBoxItemProps } from "@/components/List/components/Items/components/Item/hooks/useBoxItemProps";
import { useList } from "@/components/List/hooks/useList";
import ItemsListBoxItemView from "@/views/ItemsListBoxItemView";
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

  const { boxItemProps, children } = useBoxItemProps(props);

  if (!itemView) {
    return null;
  }

  const textValue = itemView.textValue ? itemView.textValue(data) : undefined;
  const href = itemView.href ? itemView.href(data) : undefined;

  const hasAction = !!boxItemProps.onAction || !!href;

  return (
    <ItemsListBoxItemView
      id={id}
      textValue={textValue}
      href={href}
      target={itemView.target}
      hasAction={hasAction}
      isTile={list.viewMode.isTiles}
      {...boxItemProps}
    >
      <Suspense
        fallback={<ListItemSkeletonView viewMode={list.viewMode.value} />}
      >
        {children}
      </Suspense>
    </ItemsListBoxItemView>
  );
};

export const ItemContainer: FC<Props> = (props) => {
  const list = useList();
  return (
    <ItemsListBoxItemView
      textValue="-"
      className={styles.item}
      isTile={list.viewMode.isTiles}
    >
      {props.children}
    </ItemsListBoxItemView>
  );
};

export default Item;
