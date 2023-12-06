import React, { FC } from "react";
import styles from "./styles.module.css";
import { testLib } from "@/lib/testLib.js";
import intlMessages from "./intl/*.json";
import { useLocalizedStringFormatter } from "react-aria";

interface Props {
  foo: boolean;
}

export const Button: FC<Props> = (props) => {
  testLib();

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  return (
    <div className={styles.root}>
      Button {stringFormatter.format("example")}{" "}
      {props.foo ? "with" : "without"} <span className={styles.foo}>foo</span>
    </div>
  );
};

export default Button;
