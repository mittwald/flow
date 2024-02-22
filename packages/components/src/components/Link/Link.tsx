import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import styles from "./Link.module.scss";
import clsx from "clsx";
import ActionStateIcon from "@/components/ActionStateIcon";
import { Wrap } from "@/components/Wrap";

export interface LinkProps
  extends PropsWithChildren<Omit<Aria.LinkProps, "children">> {
  /** @default "default" */
  variant?: "default" | "danger";

  isPending?: boolean;
  isSucceeded?: boolean;
  isFailed?: boolean;
}

export const Link: FC<LinkProps> = (props) => {
  const {
    children,
    className,
    variant = "default",
    isPending,
    isDisabled,
    isSucceeded,
    isFailed,
    ...rest
  } = useProps("Link", props);

  const rootClassName = clsx(
    styles.link,
    isPending && styles.isPending,
    isSucceeded && styles.isSucceeded,
    isFailed && styles.isFailed,
    styles[variant],
    className,
  );

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
    },
  };

  const hasActionState = isPending || isSucceeded || isFailed;

  const actionStateIcon = (
    <ActionStateIcon
      isSucceeded={isSucceeded}
      isPending={isPending}
      isFailed={isFailed}
      className={styles.actionStateIcon}
    />
  );

  return (
    <Aria.Link
      className={rootClassName}
      isDisabled={isDisabled || hasActionState}
      {...rest}
    >
      <PropsContextProvider props={propsContext}>
        <Wrap if={hasActionState}>
          <span className={styles.content}>{children}</span>
        </Wrap>
      </PropsContextProvider>

      {actionStateIcon}
    </Aria.Link>
  );
};

export default Link;
