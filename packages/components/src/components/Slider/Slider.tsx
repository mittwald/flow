import type { FC, PropsWithChildren } from "react";
import React from "react";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Slider.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import { IconMinus, IconPlus } from "@/components/Icon/components/icons";

//translate label
//add initialvalue

export interface SliderProps
  extends FlowComponentProps<"Slider">,
    PropsWithChildren<Aria.SliderProps>,
    Pick<Aria.SliderThumbProps, "name"> {}

export const Slider: FC<SliderProps> = flowComponent("Slider", (props) => {
  const { className, children, name, ...rest } = props;

  const rootClassName = clsx(styles.slider, className);

  const propsContext: PropsContext = {
    Label: {
      unstyled: true,
    },
  };

  return (
    <Aria.Slider className={rootClassName} {...rest}>
      <div className={styles.text}>
        <Aria.SliderOutput className={styles.value} />
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>
      <Aria.SliderTrack className={styles.track}>
        {({ state }) => (
          <>
            <Button
              onPress={() => state.decrementThumb(0)}
              aria-label="decrement"
              size="s"
              variant="plain"
              className={styles.decrement}
            >
              <IconMinus />
            </Button>
            <Button
              onPress={() => state.incrementThumb(0)}
              size="s"
              variant="plain"
              className={styles.increment}
            >
              <IconPlus />
            </Button>
            <div
              className={styles.fill}
              style={{ width: state.getThumbPercent(0) * 100 + "%" }}
            />
            <Aria.SliderThumb name={name} className={styles.thumb} />
          </>
        )}
      </Aria.SliderTrack>
    </Aria.Slider>
  );
});

export default Slider;
