/* auto-generated file */
import React, { type ComponentProps, type FC } from "react";
import { IconRedo as IconImport } from "@mittwald/flow-icons";
import { type Icon } from "@/components/Icon";
import View from "@/views/IconView";
import { useContextIcon } from "../IconSetProvider";

export const IconRedo: FC<Omit<ComponentProps<typeof Icon>, "children">> = (
  props,
) => {
  const fromContext = useContextIcon("Redo");
  const Icon = fromContext ?? IconImport;
  return (
    <View {...props}>
      <Icon />
    </View>
  );
};

export default IconRedo;
