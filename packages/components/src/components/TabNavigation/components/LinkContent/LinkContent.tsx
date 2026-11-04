import type { FC } from "react";
import type { LinkProps } from "@/components/Link";
import { MenuItem } from "@/components/MenuItem";
import { Text } from "@/components/Text";
import { SkeletonTextContent } from "@/components/SkeletonMode/components/SkeletonTextContent";
import { hasContent } from "@/components/SkeletonMode/lib/hasContent";
import { UiComponentTunnelEntry } from "@/components/UiComponentTunnel/UiComponentTunnelEntry";
import styles from "../../TabNavigation.module.scss";

interface Props {
  linkProps: Partial<LinkProps>;
}

/**
 * Renders the content of a link inside the tab navigation and mirrors the link
 * as a menu item into the overflow context menu (via tunnel). The context menu
 * only renders the menu items of the currently collapsed links.
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

  const text = (
    <Text emulateBoldWidth>
      <span className={styles.text}>{children}</span>
    </Text>
  );

  /* Text would take the wrapping span for content and draw a bar of zero
     width, so a link without content gets the default bar of Navigation. The
     span gives the bar a line box, as a flex item it would lose the line
     height. */
  const emptyText = (
    <span>
      <SkeletonTextContent defaultWidth="6em" />
    </span>
  );

  return (
    <>
      {hasContent(children) ? text : emptyText}
      <UiComponentTunnelEntry id="menuItems" component="TabNavigation">
        <MenuItem
          aria-current={ariaCurrent}
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
