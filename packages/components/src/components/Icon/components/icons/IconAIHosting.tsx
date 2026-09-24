/* auto-generated file */
import React, { type ComponentProps, type FC } from "react";
import { IconAIHosting as IconImport } from "@mittwald/flow-icons";
import { type Icon } from "@/components/Icon";
import View from "@/views/IconView";
import { useContextIcon } from "../IconSetProvider";

export const IconAIHosting: FC<
  Omit<ComponentProps<typeof Icon>, "children">
> = (props) => {
  const fromContext = useContextIcon("AIHosting");
  const Icon = fromContext ?? IconImport;
  return (
    <View {...props}>
      <Icon />
    </View>
  );
};

export default IconAIHosting;
