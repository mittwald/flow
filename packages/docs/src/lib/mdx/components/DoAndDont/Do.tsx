import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { IconCheck } from "@mittwald/flow-react-components/Icons";

export const Do: FC<PropsWithChildren> = (props) => {
  return (
    <div className={styles.do}>
      <Heading level={4}>
        <IconCheck /> Do
      </Heading>
      {props.children}
    </div>
  );
};

export default Do;
