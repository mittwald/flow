import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Item.module.scss";
import type { Key } from "react-aria-components";
import * as Aria from "react-aria-components";
import { useList } from "@/components/List/hooks/useList";
import { useGridItemProps } from "@/components/List/components/Items/components/Item/hooks/useGridItemProps";
import ItemView from "@/components/List/views/Items/ItemContainer";
import { useViewComponents } from "@/lib/viewComponentContext/useViewComponents";

interface Props extends PropsWithChildren {
  id: Key;
  data: never;
}

export const Item = (props: Props) => {
  const { id, data } = props;
  const list = useList();

  const itemViewSettings = list.itemView;
  const { Item: View = ItemView } = useViewComponents("List");

  const { gridItemProps, children } = useGridItemProps(props);

  const textValue = itemViewSettings?.textValue
    ? itemViewSettings.textValue(data)
    : "---";
  const href = itemViewSettings?.href ? itemViewSettings.href(data) : undefined;

  return (
    <View id={id} textValue={textValue} key={id} href={href} {...gridItemProps}>
      {children}
    </View>
  );
};

export const ItemContainer: FC<PropsWithChildren> = (props) => (
  <Aria.GridListItem textValue="-" className={styles.item}>
    {props.children}
  </Aria.GridListItem>
);

export default Item;
