import type { ComponentProps, PropsWithChildren } from "react";
import clsx from "clsx";
import { Button } from "@/components/Button";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Text } from "@/components/Text";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";
import { LinkContent } from "./components/LinkContent";
import styles from "./HorizontalNavigation.module.scss";
import locales from "./locales/*.locale.json";
import { useCollapsingItems } from "./useCollapsingItems";

export interface HorizontalNavigationProps
  extends
    PropsWithChildren<ComponentProps<"nav">>,
    PropsWithClassName,
    FlowComponentProps<HTMLElement> {}

/** @flr-generate all */
export const HorizontalNavigation = flowComponent(
  "HorizontalNavigation",
  (props) => {
    const { children, className, ref, ...rest } = props;

    const stringFormatter = useLocalizedStringFormatter(
      locales,
      "HorizontalNavigation",
    );

    const { listRef, moreRef, visibleCount, hasOverflow, menuHasCurrentItem } =
      useCollapsingItems();

    const rootClassName = clsx(
      styles.horizontalNavigation,
      hasOverflow && styles.collapsed,
      className,
    );

    const propsContext: PropsContext = {
      Link: {
        wrapWith: <li />,
        className: styles.link,
        unstyled: true,
        children: dynamic((linkProps) => <LinkContent linkProps={linkProps} />),
      },
    };

    return (
      <nav className={rootClassName} role="navigation" {...rest} ref={ref}>
        <ul ref={listRef}>
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </ul>
        <div className={styles.more} ref={moreRef}>
          <ContextMenuTriggerView>
            <Button
              unstyled
              className={clsx(
                styles.moreButton,
                menuHasCurrentItem && styles.current,
              )}
            >
              <Text emulateBoldWidth>
                {stringFormatter.format("moreButton.title")}
              </Text>
              <IconChevronDown />
            </Button>
            <ContextMenuView>
              <UiComponentTunnelExit
                id="menuItems"
                component="HorizontalNavigation"
                children={(menuItems) =>
                  Array.isArray(menuItems)
                    ? menuItems.slice(visibleCount ?? menuItems.length)
                    : menuItems
                }
              />
            </ContextMenuView>
          </ContextMenuTriggerView>
        </div>
      </nav>
    );
  },
);

export default HorizontalNavigation;
