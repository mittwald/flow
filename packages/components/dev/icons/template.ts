import type { IconNames } from "./names";

export const getIconFileContent = (iconName: string): string => {
  return getTablerIconFileContent(iconName);
};

const getTablerIconFileContent = (iconName: string): string => `\
  import React, { type ComponentProps, type FC } from "react";
  import { Icon${iconName} as IconImport } from "@mittwald/flow-icons";
  import { type Icon } from "@/components/Icon";
  import View from "@/views/IconView";
  import { useContextIcon } from "../IconSetProvider";
  
  export const Icon${iconName}: FC<Omit<ComponentProps<typeof Icon>, "children">> = (
    props,
  ) => {
    const fromContext = useContextIcon("${iconName}");
    const Icon = fromContext ?? IconImport;
    return (
      <View {...props}>
        <Icon />
      </View>
    );
  };

  export default Icon${iconName};
`;

export const getIndexFileContent = (icons: IconNames) =>
  icons
    .map(
      (icon) => `\
        export { Icon${icon} } from "./Icon${icon}";
      `,
    )
    .join("");
