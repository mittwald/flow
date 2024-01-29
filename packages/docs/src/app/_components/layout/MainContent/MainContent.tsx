import { FC, PropsWithChildren, ReactNode } from "react";
import styles from "./MainContent.module.scss";
import Heading from "@mittwald/flow-next-components/Heading";

interface Props extends PropsWithChildren {
  title?: ReactNode;
}

export const MainContent: FC<Props> = (props) => {
  const { title, children } = props;
  return (
    <div className={styles.root}>
      <Heading level={2}>{title}</Heading>
      <div className={styles.mainContent}>{children}</div>
    </div>
  );
};

export default MainContent;
