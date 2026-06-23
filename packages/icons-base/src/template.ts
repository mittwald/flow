import {
  type IconDefinition,
  type IconDefinitions,
  type IconVendor,
} from "./definitions";

const upperCaseFirst = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const vendorIconTemplates: Record<
  IconVendor,
  (iconName: string, vendorIconName: string) => string
> = {
  tb: (iconName, vendorIconName) => `\
  import { Icon${vendorIconName} as Icon } from "@tabler/icons-react";
  import type { FC } from "react";
  export const Icon${iconName} = Icon as FC;
  `,
  fa: (iconName, vendorIconName) => `\
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-nocheck
    import { fa${upperCaseFirst(vendorIconName)} as icon } from "@fortawesome/sharp-regular-svg-icons";
    import {
      FontAwesomeIcon,
      type FontAwesomeIconProps,
    } from "@fortawesome/react-fontawesome";
    import type { FC } from "react";

    export const Icon${iconName}: FC<Omit<FontAwesomeIconProps, "icon">> = (props) => (
      <FontAwesomeIcon icon={icon} {...props} />
    );
    `,
};

export const getIconFileContent = (
  iconName: string,
  icon: IconDefinition,
  vendor: IconVendor,
): string => {
  if (icon.svg) {
    return getCustomSvgFileContent(iconName, icon.svg);
  }

  const definition = icon[vendor];

  if (!definition) {
    throw new Error(
      `Icon "${iconName}" does not have a definition for vendor "${vendor}".`,
    );
  }

  return vendorIconTemplates[vendor](iconName, definition);
};

const getCustomSvgFileContent = (
  iconName: string,
  iconSvg: string,
): string => `\
  import { cloneElement, type FC, type SVGProps } from "react";
  
  export const Icon${iconName}: FC<SVGProps<SVGSVGElement>> = (props) => {
    return cloneElement(
      ${iconSvg},
      props,
    );
  };
  
  export default Icon${iconName};
`;

export const getIndexFileContent = (icons: IconDefinitions) => {
  const iconsContent = Object.keys(icons)
    .map(
      (icon) => `\
        export { Icon${icon} } from "./Icon${icon}.tsx";
      `,
    )
    .join("");

  return `\
    ${iconsContent}
    export * from "../iconSet.ts";
  `;
};

export const getIconSetFileContent = (
  iconSetName: string,
  icons: IconDefinitions,
) => {
  const imports = Object.keys(icons)
    .map(
      (icon) => `\
        import { Icon${icon} as ${icon} } from "./components/Icon${icon}.tsx";
      `,
    )
    .join("");

  const registryEntries = Object.keys(icons)
    .map(
      (icon) => `\
        ${icon},
      `,
    )
    .join("");

  return `\
    ${imports}
    
    export const ${iconSetName} = {
      ${registryEntries}
    } as const;

    export default ${iconSetName};
  `;
};
