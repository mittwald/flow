import type { FC, PropsWithChildren } from "react";
import styles from "./NavigationAvatar.module.scss";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Initials from "@mittwald/flow-react-components/Initials";

export const NavigationAvatar: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <Avatar className={styles.navigationAvatar} color="teal">
      <Initials className={styles.initials}>{children}</Initials>
    </Avatar>
  );
};
