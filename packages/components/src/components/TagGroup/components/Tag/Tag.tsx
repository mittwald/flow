import React, { FC, PropsWithChildren } from "react";
import styles from "./Tag.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import { Wrap } from "@/components/Wrap";
import { Text } from "@/components/Text";

export interface TagProps
  extends PropsWithChildren<Omit<Aria.TagProps, "children">> {
}

export const Tag: FC<TagProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tag, className);


  return (
    <Aria.Tag {...rest} className={rootClassName}>
      {({ allowsRemoving }) => (
        <>
          <Wrap if={allowsRemoving}>
            <Text className={styles.text}>{children}</Text>
          </Wrap>
          {allowsRemoving && <Button className={styles.closeButton} slot="remove" variant="secondary" style="plain"
                                     size="s"><IconClose /></Button>}
        </>
      )}
    </Aria.Tag>
  );
};

export default Tag;
