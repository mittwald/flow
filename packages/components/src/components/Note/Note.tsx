import React, { FC, HTMLAttributes, PropsWithChildren } from "react";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import styles from "./Note.module.css";
import clsx from "clsx";
import { StatusIcon } from "@/components/StatusIcon";
import { StatusVariantProps } from "@/lib/types/props";

export interface NoteProps
  extends PropsWithChildren<HTMLAttributes<HTMLElement>>,
    StatusVariantProps<"success"> {}

export const Note: FC<NoteProps> = (props) => {
  const {
    children,
    className,
    variant = "info",
    ...rest
  } = useProps("Note", props);

  const rootClassName = clsx(className, styles.root, styles[variant]);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.customIcon,
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
