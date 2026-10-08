import { AlertIcon } from "@/components/AlertIcon";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import { Link } from "@/components/Link";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithStatus } from "@/lib/types/props";
import clsx from "clsx";
import type { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./Notification.module.scss";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";

export interface NotificationProps
  extends PropsWithChildren<ComponentProps<"div">>, PropsWithStatus {
  /** A link that is triggered when clicking the notification. */
  href?: string;
  /** Whether the notification should disappear automatically after some time. */
  autoClose?: boolean;
  /** Handler that is called when the notification is clicked. */
  onClick?: () => void;
  /**
   * Handler that is called when the close button of the notification is
   * clicked.
   */
  onClose?: () => void;
}

/** @flr-generate all */
export const Notification: FC<NotificationProps> = (props) => {
  const {
    children,
    className,
    status = "info",
    role = "alert",
    href,
    onClick,
    onClose,
    autoClose: ignoredAutoClose,
    ...rest
  } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);
  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(
    styles.notification,
    styles[status],
    (onClick || onClose || href) && !isSkeleton && styles.hasLink,
    isSkeleton && styles.skeleton,
    className,
  );

  const propsContext: PropsContext = {
    Heading: {
      className: styles.heading,
      level: 4,
      children: dynamic((props) => (
        <>
          <AlertIcon status={status} className={styles.icon} />
          {props.children}
        </>
      )),
    },
    Text: {
      className: styles.text,
    },
  };

  const closeButton = onClose && (
    <Button
      size="s"
      className={styles.close}
      variant="plain"
      color="secondary"
      onPress={onClose}
      aria-label={stringFormatter.format("notification.close")}
    >
      <IconClose />
    </Button>
  );

  const content = (
    <PropsContextProvider props={propsContext}>{children}</PropsContextProvider>
  );

  /*
   * In the mode, the content is not wrapped in a link: a link would draw its
   * whole content as one text bar, and there is nothing to click.
   */
  const skeletonBody = <div className={styles.link}>{content}</div>;

  const linkBody = (
    <Link unstyled href={href} className={styles.link} onPress={onClick}>
      {content}
    </Link>
  );

  return (
    <div
      {...rest}
      className={rootClassName}
      role={role}
      // See https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/interactions/src/useInteractOutside.ts#L126C31-L126C58
      data-react-aria-top-layer
    >
      {isSkeleton ? skeletonBody : linkBody}
      {closeButton}
    </div>
  );
};

export default Notification;
