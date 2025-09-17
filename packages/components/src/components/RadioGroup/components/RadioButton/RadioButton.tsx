import styles from "./RadioButton.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { RadioProps } from "@/components/RadioGroup";
import { Radio } from "@/components/RadioGroup";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export type RadioButtonProps = RadioProps;

/** @flr-generate all */
export const RadioButton = flowComponent("RadioButton", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.radioButton, className);

  const propsContext: PropsContext = {
    Text: {
      className: styles.label,
    },
    Content: {
      className: styles.content,
    },
  };

  return (
    <Radio {...rest} className={rootClassName} ref={ref}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Radio>
  );
});

export default RadioButton;
