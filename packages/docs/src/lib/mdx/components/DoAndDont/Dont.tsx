import type { FC, PropsWithChildren } from "react";
import styles from "../MdxFileView/customComponents.module.css";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { IconClose } from "@mittwald/flow-react-components/Icons";

export const Dont: FC<PropsWithChildren> = (props) => {
  return (
    <div className={styles.dont}>
      <Heading level={4}>
        <IconClose /> Don`t
      </Heading>
      {props.children}
    </div>
  );
};

export default Dont;
