/* auto-generated file */
import React, { type ComponentProps, type FC } from "react";
import { IconDelete as IconImport } from "@mittwald/flow-icons";
import { type Icon } from "@/components/Icon";
import View from "@/views/IconView";
import { useContextIcon } from "../IconSetProvider";

export const IconDelete: FC<Omit<ComponentProps<typeof Icon>, "children">> = (
  props,
) => {
  const fromContext = useContextIcon("Delete");
  const Icon = fromContext ?? IconImport;
  return (
    <View {...props}>
      <Icon />
    </View>
  );
};

export default IconDelete;
