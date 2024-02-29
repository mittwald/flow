import React, { FC, PropsWithChildren, ReactElement } from "react";
import * as Aria from "react-aria-components";
import styles from "./TagGroup.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { TagProps } from "@/components/TagGroup/components/Tag";
import { TagList } from "@/components/TagGroup/components/TagList";
import { Label } from "@/components/Label";

export interface TagGroupProps<T>
  extends Omit<Aria.TagGroupProps, 'children'>,
    Pick<Aria.TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
label?:string
}

export const TagGroup: FC<TagGroupProps<any>> = (props) => {
  const { children, className,renderEmptyState,items, selectionMode = "multiple",label, ...rest } = props;

  const rootClassName = clsx(styles.tagGroup, className);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
    },
  };

  return (
    <Aria.TagGroup
      {...rest}
      selectionMode={selectionMode}
      className={rootClassName}
    >
      <PropsContextProvider props={propsContext}>
        <Label>{label}</Label>
        <TagList items={items} renderEmptyState={renderEmptyState}>
        {children}</TagList>
      </PropsContextProvider>
    </Aria.TagGroup>
  );
};

export default TagGroup;
