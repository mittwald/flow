/* auto-generated file */
import React, { type ComponentProps, type FC } from "react";
import { IconStart as IconImport } from "@mittwald/flow-icons";
import { type Icon } from "@/components/Icon";
import View from "@/views/IconView";
import { useContextIcon } from "../IconSetProvider";

export const IconStart: FC<Omit<ComponentProps<typeof Icon>, "children">> = (
  props,
) => {
  const fromContext = useContextIcon("Start");
  const Icon = fromContext ?? IconImport;
  return (
    <View {...props}>
      <Icon />
    </View>
  );
};

export default IconStart;
