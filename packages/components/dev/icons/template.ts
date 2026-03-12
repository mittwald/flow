import type {
  IconDefinition,
  IconDefinitions,
  TablerIconName,
} from "./definitions";

export const getIconFileContent = (
  iconName: string,
  icon: IconDefinition,
): string => {
  if (icon.tb) {
    return getTablerIconFileContent(iconName, icon.tb);
  }

  return getCustomSvgFileContent(iconName, icon.svg);
};

const getTablerIconFileContent = (
  iconName: string,
  iconTabler: TablerIconName,
): string => `\
  import React, { type ComponentProps, type FC } from "react";
  import { Icon${iconTabler} as Tabler } from "@tabler/icons-react";
  import { type Icon } from "@/components/Icon";
  import View from "@/views/IconView";
  
  export const Icon${iconName}: FC<Omit<ComponentProps<typeof Icon>, "children">> = (
    props,
  ) => {
    return (
      <View {...props}>
        <Tabler />
      </View>
    );
  };

  export default Icon${iconName};
`;

const getCustomSvgFileContent = (
  iconName: string,
  iconSvg: string,
): string => `\
  import React, { type ComponentProps, type FC } from "react";
  import { Icon } from "@/components/Icon";
  
  export const Icon${iconName}: FC<Omit<ComponentProps<typeof Icon>, "children">> = (
    props,
  ) => {
    return (
      <Icon {...props}>${iconSvg}</Icon>
    );
  };
  
  export default Icon${iconName};
`;

export const getIndexFileContent = (icons: IconDefinitions) =>
  Object.keys(icons)
    .map(
      (icon) => `\
        export { Icon${icon} } from "./Icon${icon}";
      `,
    )
    .join("");
