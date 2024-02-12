import React, { ComponentProps, FC, PropsWithChildren } from "react";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import styles from "./Note.module.scss";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import { StatusVariantProps } from "@/lib/types/props";

export interface NoteProps
  extends PropsWithChildren<ComponentProps<"aside">>,
    StatusVariantProps<"success"> {}

export const Note: FC<NoteProps> = (props) => {
  const {
    children,
    className,
    variant = "info",
    ...rest
  } = useProps("Note", props);

  const rootClassName = clsx(styles.note, styles[variant], className);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.customIcon,
      "aria-hidden": false,
    },
    Heading: {
      className: styles.heading,
      level: 3,
    },
    Content: {
      className: styles.content,
    },
  };

  return (
    <aside {...rest} className={rootClassName}>
      <StatusIcon className={styles.statusIcon} variant={variant} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </aside>
  );
};

export default Note;
