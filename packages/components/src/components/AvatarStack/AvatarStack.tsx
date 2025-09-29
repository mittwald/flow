import type { FC, PropsWithChildren } from "react";
import { Children } from "react";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import styles from "./AvatarStack.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Wrap } from "@/components/Wrap";

export interface AvatarStackProps
  extends PropsWithClassName,
    PropsWithChildren {
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
export const AvatarStack: FC<AvatarStackProps> = (props) => {
  const {
    className,
    children,
    totalCount = 0,
    size = "m",
    onCountPress,
    ...rest
  } = props;

  const avatarCount = Children.count(children);

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
      <div className={rootClassName} {...rest}>
        {children}
        {additionalItemsCount > 0 && (
          <Wrap if={onCountPress}>
            <Button onPress={onCountPress}>
              <Avatar size={size}>+{additionalItemsCount}</Avatar>
            </Button>
          </Wrap>
        )}
      </div>
    </PropsContextProvider>
  );
};

export default AvatarStack;
