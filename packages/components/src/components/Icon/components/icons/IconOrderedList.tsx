/* auto-generated file */
import React, { type ComponentProps, type FC } from "react";
import { IconOrderedList as IconImport } from "@mittwald/flow-icons";
import { type Icon } from "@/components/Icon";
import View from "@/views/IconView";
import { useContextIcon } from "../IconSetProvider";

export const IconOrderedList: FC<
  Omit<ComponentProps<typeof Icon>, "children">
> = (props) => {
  const fromContext = useContextIcon("OrderedList");
  const Icon = fromContext ?? IconImport;
  return (
    <View {...props}>
      <Icon />
    </View>
  );
};

export default IconOrderedList;
