import {
  CustomSvgIconDefinition,
  IconDefinition,
  IconDefinitions,
  TablerIconName,
} from "./definitions";

export const getIconFileContent = (
  iconName: string,
  icon: IconDefinition,
): string => {
  if (typeof icon === "string") {
    return getTablerIconFileContent(iconName, icon);
  }
  return getCustomSvgFileContent(iconName, icon);
};

const getTablerIconFileContent = (
  iconName: string,
  iconTabler: TablerIconName,
): string => `\
  import React, { ComponentProps, FC } from "react";
  import { Icon${iconTabler} as Tabler } from "@tabler/icons-react";
  import { Icon } from "@/components/Icon";
  
  export const Icon${iconName}: FC<Omit<ComponentProps<typeof Icon>, "children">> = (
    props,
  ) => (
    <Icon {...props}>
      <Tabler />
    </Icon>
  );
  
  export default Icon${iconName};
`;

const getCustomSvgFileContent = (
  iconName: string,
  iconSvg: CustomSvgIconDefinition,
): string => `\
  import React, { ComponentProps, FC } from "react";
  import { Icon } from "@/components/Icon";
  
  export const Icon${iconName}: FC<Omit<ComponentProps<typeof Icon>, "children">> = (
    props,
  ) => {
    return (
      <Icon {...props}>{\`${iconSvg.svg}\`}</Icon>
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
