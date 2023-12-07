import React, { FC } from "react";
import styles from "./styles.module.css";
import { testLib } from "@/lib/testLib.js";
import { Icon } from "@/components/Icon";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";

interface Props {
  foo: boolean;
}

export const Button: FC<Props> = (props) => {
  testLib();
  return (
    <div className={styles.root}>
      Button {props.foo ? "with" : "without"}{" "}
      <span className={styles.foo}>foo</span>
      <Icon faIcon={faStar} />
    </div>
  );
};

export default Button;
