import type { FC } from "react";
import styles from "./NavigationAvatar.module.scss";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Initials from "@mittwald/flow-react-components/Initials";

interface Props {
  title: string;
}

export const NavigationAvatar: FC<Props> = (props) => {
  const { title } = props;

  return (
    <Avatar className={styles.navigationAvatar} size="l">
      <Initials>{title}</Initials>
    </Avatar>
  );
};
