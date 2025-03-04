import { Button } from "@/components/Button";
import { IconMinus, IconPlus } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import * as Aria from "react-aria-components";
import locales from "./locales/*.locale.json";
import styles from "./Slider.module.scss";

export interface SliderProps
  extends FlowComponentProps,
    PropsWithChildren<Aria.SliderProps>,
    Pick<Aria.SliderThumbProps, "name"> {
  showInitialMarker?: boolean;
}

/** @flr-generate all */
export const Slider = flowComponent("Slider", (props) => {
  const {
    className,
    children,
    name,
    isDisabled,
    defaultValue,
    showInitialMarker,
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
              onPress={() => state.incrementThumb(0)}
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
