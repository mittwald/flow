import type { FC } from "react";
import clsx from "clsx";
import type { LinkProps } from "@/components/Link";
import { MenuItem } from "@/components/MenuItem";
import { Text } from "@/components/Text";
import { UiComponentTunnelEntry } from "@/components/UiComponentTunnel/UiComponentTunnelEntry";
import styles from "../../HorizontalNavigation.module.scss";

interface Props {
  linkProps: Partial<LinkProps>;
}

/**
 * Renders the content of a link inside the horizontal navigation and mirrors
 * the link as a menu item into the overflow context menu (via tunnel). The
 * context menu only renders the menu items of the currently collapsed links.
 */
export const LinkContent: FC<Props> = (props) => {
  const { linkProps } = props;

  const {
    children,
    href,
    target,
    rel,
    download,
    hrefLang,
    ping,
    referrerPolicy,
    routerOptions,
    "aria-label": ariaLabel,
    "aria-current": ariaCurrent,
  } = linkProps;

  const isCurrent = !!ariaCurrent && ariaCurrent !== "false";

  return (
    <>
      <Text emulateBoldWidth>
        <span className={styles.text}>{children}</span>
      </Text>
      <UiComponentTunnelEntry id="menuItems" component="HorizontalNavigation">
        <MenuItem
          className={clsx(styles.menuItem, isCurrent && styles.current)}
          href={href}
          target={target}
          rel={rel}
          download={download}
          hrefLang={hrefLang}
          ping={ping}
          referrerPolicy={referrerPolicy}
          routerOptions={routerOptions}
          aria-label={ariaLabel}
        >
          {children}
        </MenuItem>
      </UiComponentTunnelEntry>
    </>
  );
};

export default LinkContent;
