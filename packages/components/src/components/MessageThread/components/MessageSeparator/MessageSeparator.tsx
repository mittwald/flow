import type { PropsWithChildren } from "react";
import styles from "./MessageSeparator.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { Separator } from "@/components/Separator";
import { Content } from "@/components/Content";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import locales from "../../locales/*.locale.json";
import * as Aria from "react-aria-components";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface MessageSeparatorProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps<HTMLLIElement> {}

/** @flr-generate all */
export const MessageSeparator = flowComponent("MessageSeparator", (props) => {
  const { children, className, ref } = props;

  const rootClassName = clsx(styles.messageSeparator, className);

  const formatter = useLocalizedStringFormatter(locales, "MessageThread");

  return (
    <li ref={ref} className={rootClassName}>
      <Separator className={styles.separator} />
      <Aria.VisuallyHidden>
        {formatter.format("separator.label")}
      </Aria.VisuallyHidden>
      <Content className={styles.content}>{children}</Content>
    </li>
  );
});

export default MessageSeparator;
