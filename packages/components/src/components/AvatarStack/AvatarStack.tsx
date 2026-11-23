import type { PropsWithChildren } from "react";
import { Children } from "react";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import styles from "./AvatarStack.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Wrap } from "@/components/Wrap";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface AvatarStackProps
  extends PropsWithClassName, PropsWithChildren, FlowComponentProps {
  /**
   * The total count of items, as avatars should only be displayed for the first
   * view
   */
  totalCount?: number;
  /** The onPress action of the additional items count element */
  onCountPress?: () => void;
  /** The size of the avatars inside the stack. @default "m" */
  size?: "xs" | "s" | "m" | "l";
}

/** @flr-generate all */
export const AvatarStack = flowComponent("AvatarStack", (props) => {
  const {
    className,
    children,
    totalCount = 0,
    size = "m",
    onCountPress,
    ref,
  } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "AvatarStack");

  const avatarCount = Children.toArray(children).length;

  const additionalItemsCount = totalCount - avatarCount;

  const rootClassName = clsx(
    styles.avatarStack,
    styles[`size-${size}`],
    className,
  );

  const propsContext: PropsContext = {
    Avatar: { className: styles.avatar, size },
    Button: {
      className: styles.avatar,
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <div ref={ref} className={rootClassName}>
        {children}
        {additionalItemsCount > 0 && (
          <Wrap if={onCountPress}>
            <Button onPress={onCountPress}>
              <Avatar
                size={size}
                label={stringFormatter.format("additionalItems", {
                  count: additionalItemsCount,
                })}
              >
                +{additionalItemsCount}
              </Avatar>
            </Button>
          </Wrap>
        )}
      </div>
    </PropsContextProvider>
  );
});

export default AvatarStack;
