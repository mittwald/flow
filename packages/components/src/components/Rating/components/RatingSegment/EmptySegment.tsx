import { type FC, type PropsWithChildren } from "react";
import type { RatingProps } from "@/components/Rating";
import styles from "../../Rating.module.scss";
import { IconStar } from "@/components/Icon/components/icons";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";

interface Props extends PropsWithChildren {
  size: RatingProps["size"];
}

export const EmptySegment: FC<Props> = (props) => {
  const { size, children } = props;

  const propsContext: PropsContext = {
    Icon: {
      size,
      "aria-hidden": true,
      className: styles.empty,
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      {children ?? (
        <IconStar aria-hidden size={size} className={styles.empty} />
      )}
    </PropsContextProvider>
  );
};
