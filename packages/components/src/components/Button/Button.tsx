import React, { FC } from "react";
import styles from "./styles.module.css";
import { testLib } from "@/lib/testLib.js";
import { IconCustomer } from "@/components/Icon";
import IconLoading from "@/components/Icon/components/IconLoading";

interface Props {
  foo: boolean;
}

export const Button: FC<Props> = (props) => {
  testLib();
  return (
    <div className={styles.root}>
      Button {props.foo ? "with" : "without"}{" "}
      <span className={styles.foo}>foo</span>
      <IconCustomer />
      <IconLoading />
    </div>
  );
};

export default Button;
