import React, { FC } from "react";
import styles from "./styles.module.css";
import { testLib } from "@/lib/testLib.js";

interface Props {
  foo: boolean;
}

export const Slider: FC<Props> = (props) => {
  testLib();
  return (
    <div className={styles.root}>
      Slider {props.foo ? "with" : "without"} foo
    </div>
  );
};

export default Slider;
