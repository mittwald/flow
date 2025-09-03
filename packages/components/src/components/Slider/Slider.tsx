import type { PropsWithChildren } from "react";
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
  /** Whether the marker for the initial value should be visible */
  showInitialMarker?: boolean;
  /** Unit suffix appended to the displayed value */
  unit?: string;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Slider = flowComponent("Slider", (props) => {
  const {
    className,
    children,
    name,
    isDisabled,
    defaultValue,
    showInitialMarker,
    step,
    unit,
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
      step={step}
      {...rest}
    >
      <div className={styles.text}>
        <span>
          <Aria.SliderOutput className={styles.value} />
          {unit && <b>{unit}</b>}
        </span>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>

      <Aria.SliderTrack className={styles.track}>
        {({ state }) => (
          <>
            <Button
              onPress={() => state.decrementThumb(0, step)}
              aria-label={stringFormatter.format("slider.decrement")}
              variant="plain"
              color="secondary"
              className={styles.decrement}
              isDisabled={isDisabled}
              excludeFromTabOrder
            >
              <IconMinus />
            </Button>

            <Button
              onPress={() => state.incrementThumb(0, step)}
              aria-label={stringFormatter.format("slider.increment")}
              variant="plain"
              color="secondary"
              className={styles.increment}
              isDisabled={isDisabled}
              excludeFromTabOrder
            >
              <IconPlus />
            </Button>

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

            <Aria.SliderThumb name={name} className={styles.handle} />
          </>
        )}
      </Aria.SliderTrack>
    </Aria.Slider>
  );
});

export default Slider;
