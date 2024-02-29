export const getIconFileContent = (
  iconFlow: string,
  iconTabler: string,
): string => `\
  import React, { ComponentProps, FC } from "react";
  import { Icon${iconTabler} as Tabler } from "@tabler/icons-react";
  import { Icon } from "@/components/Icon";
  
  export const Icon${iconFlow}: FC<Omit<ComponentProps<typeof Icon>, "children">> = (
    props,
  ) => (
    <Icon {...props}>
      <Tabler />
    </Icon>
  );
  
  export default Icon${iconFlow};
`;

export const getIndexFileContent = (icons: string[]) =>
  icons
    .map(
      (icon) => `\
        export { Icon${icon} } from "./Icon${icon}";
      `,
    )
    .join("");
