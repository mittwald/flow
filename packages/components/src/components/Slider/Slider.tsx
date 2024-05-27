import type { FC, PropsWithChildren } from "react";
import React from "react";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Slider.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";

export interface SliderProps
  extends FlowComponentProps<"Slider">,
    PropsWithChildren<Aria.SliderProps> {}

export const Slider: FC<SliderProps> = flowComponent("Slider", (props) => {
  const { className, children, ...rest } = props;

  const rootClassName = clsx(styles.slider, className);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
    },
  };

  return (
    <Aria.Slider className={rootClassName} {...rest}>
      <Aria.SliderOutput className={styles.value} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <Aria.SliderTrack className={styles.track}>
        <Aria.SliderThumb className={styles.thumb} />
      </Aria.SliderTrack>
    </Aria.Slider>
  );
});

export default Slider;
