import { type FC, useContext } from "react";
import * as Aria from "react-aria-components";
import styles from "../NumberField.module.scss";

interface Props {
  id: string;
  unit: string;
}

/**
 * React-aria cannot parse a unit `Intl.NumberFormat` does not know, so the unit
 * is drawn over the input instead of being part of its value. An invisible copy
 * of the input text pushes it right behind the number. The input's name
 * references the unit, like a unit written into the label.
 */
export const NumberFieldUnit: FC<Props> = (props) => {
  const { id, unit } = props;
  const inputValue = useContext(Aria.NumberFieldStateContext)?.inputValue;

  return (
    <span
      className={styles.unitOverlay}
      data-empty={!inputValue || undefined}
      aria-hidden
    >
      <span className={styles.unitClip}>
        <span className={styles.unitSpacer}>{inputValue} </span>
        <span id={id}>{unit}</span>
      </span>
    </span>
  );
};
