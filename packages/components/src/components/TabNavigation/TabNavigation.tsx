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
import styles from "./TabNavigation.module.scss";
import locales from "./locales/*.locale.json";
import { useCollapsingItems } from "./lib/useCollapsingItems";

export interface TabNavigationProps
  extends
    PropsWithChildren<ComponentProps<"nav">>,
    PropsWithClassName,
    FlowComponentProps<HTMLElement> {}

/** @flr-generate all */
export const TabNavigation = flowComponent("TabNavigation", (props) => {
  const { children, className, ref, ...rest } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "TabNavigation");

  const { listRef, moreRef, visibleCount, hasOverflow, menuHasCurrentItem } =
    useCollapsingItems();

  const rootClassName = clsx(
    styles.tabNavigation,
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
          <ContextMenuView placement="bottom end">
            <UiComponentTunnelExit
              id="menuItems"
              component="TabNavigation"
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
});

export default TabNavigation;
