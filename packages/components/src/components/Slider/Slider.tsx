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
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export interface SliderProps
  extends FlowComponentProps,
    PropsWithChildren<Aria.SliderProps>,
    Pick<Aria.SliderThumbProps, "name"> {
  showInitialMarker?: boolean;
  showButtonControls?: boolean;
  showValue?: boolean;
}

export const Slider: FC<SliderProps> = flowComponent("Slider", (props) => {
  const {
    className,
    children,
    name,
    isDisabled,
    defaultValue,
    showInitialMarker,
    showButtonControls,
    showValue,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.slider,
    isDisabled && styles.disabled,
    className,
  );

  const stringFormatter = useLocalizedStringFormatter(locales);

  const propsContext: PropsContext = {
    Label: {
      unstyled: true,
    },
  };

  return (
    <Aria.Slider
      className={rootClassName}
      isDisabled={isDisabled}
      defaultValue={defaultValue}
      {...rest}
    >
      {showValue && (
        <div className={styles.text}>
          <Aria.SliderOutput className={styles.value} />

          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </div>
      )}

      <Aria.SliderTrack className={styles.track}>
        {({ state }) => (
          <>
            {showButtonControls && (
              <>
                <Button
                  onPress={() => state.decrementThumb(0)}
                  aria-label={stringFormatter.format("slider.decrement")}
                  size="s"
                  variant="plain"
                  className={styles.decrement}
                  isDisabled={isDisabled}
                >
                  <IconMinus />
                </Button>

                <Button
                  onPress={() => state.incrementThumb(0)}
                  aria-label={stringFormatter.format("slider.increment")}
                  size="s"
                  variant="plain"
                  className={styles.increment}
                  isDisabled={isDisabled}
                >
                  <IconPlus />
                </Button>
              </>
            )}

            <div
              className={styles.fill}
              style={{ width: state.getThumbPercent(0) * 100 + "%" }}
            />

            {showInitialMarker &&
              defaultValue &&
              typeof defaultValue === "number" && (
                <div
                  className={styles.initialMarker}
                  style={{
                    left: `calc(${state.getValuePercent(defaultValue) * 100}% - 2px)`,
                  }}
                />
              )}

            <Aria.SliderThumb name={name} className={styles.thumb} />
          </>
        )}
      </Aria.SliderTrack>
    </Aria.Slider>
  );
});

export default Slider;
