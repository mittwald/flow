import type { FC, PropsWithChildren, ReactNode } from "react";
import Heading from "@mittwald/flow-react-components/Heading";
import styles from "./MainContent.module.css";

interface Props extends PropsWithChildren {
  title?: ReactNode;
  description?: ReactNode;
}

export const MainContent: FC<Props> = (props) => {
  const { title, description, children } = props;
  return (
    <>
      <Heading className={styles.heading} level={1}>
        {title}
      </Heading>
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </>
  );
};

export default MainContent;
