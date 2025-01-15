import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Item.module.scss";
import type { Key } from "react-aria-components";
import * as Aria from "react-aria-components";
import { useList } from "~/components/List/hooks/useList";
import { useGridItemProps } from "~/components/List/components/Items/components/Item/hooks/useGridItemProps";
import { useViewComponent } from "~/lib/viewComponentContext/useViewComponent";
import * as ListViews from "~/components/List/views";

interface Props extends PropsWithChildren {
  id: Key;
  data: never;
}

export const Item = (props: Props) => {
  const { id, data } = props;
  const list = useList();

  const itemViewSettings = list.itemView;
  const Views = {
    ItemContainer: useViewComponent(
      "ListItemContainerView",
      ListViews.ItemContainer,
    ),
  };

  const { gridItemProps, children } = useGridItemProps(props);

  const textValue = itemViewSettings?.textValue
    ? itemViewSettings.textValue(data)
    : "---";
  const href = itemViewSettings?.href ? itemViewSettings.href(data) : undefined;

  return (
    <Views.ItemContainer
      id={id}
      textValue={textValue}
      key={id}
      href={href}
      {...gridItemProps}
    >
      {children}
    </Views.ItemContainer>
  );
};

export const ItemContainer: FC<PropsWithChildren> = (props) => (
  <Aria.GridListItem textValue="-" className={styles.item}>
    {props.children}
  </Aria.GridListItem>
);

export default Item;
