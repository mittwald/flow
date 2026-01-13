import { type PropsWithChildren } from "react";
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
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { useObjectRef } from "@react-aria/utils";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface SliderProps
  extends FlowComponentProps<HTMLInputElement>,
    PropsWithChildren<Aria.SliderProps>,
    Pick<Aria.SliderThumbProps, "name"> {
  /** Whether the marker for the initial value should be visible */
  showInitialMarker?: boolean;
  /** Whether the component is read only. */
  isReadOnly?: boolean;
  /** Whether the component is invalid. */
  isInvalid?: boolean;
  /** Unit suffix appended to the displayed value */
  unit?: string;
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
    isReadOnly,
    ref,
    step,
    unit,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.slider,
    isDisabled && styles.disabled,
    className,
  );

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } = useFieldComponent(props);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const objectRef = useObjectRef(ref);

  const propsContext: PropsContext = {
    ...fieldPropsContext,
    Label: {
      unstyled: true,
      tunnelId: "label",
      ...fieldPropsContext.Label,
    },
  };

  return (
    <div {...fieldProps}>
      <Aria.Slider
        {...rest}
        className={rootClassName}
        isDisabled={isDisabled}
        defaultValue={defaultValue}
      >
        <TunnelProvider>
          <PropsContextProvider props={propsContext}>
            <FieldErrorCaptureContext>{children}</FieldErrorCaptureContext>

            <div className={styles.text}>
              <span>
                <Aria.SliderOutput className={styles.value} />
                {unit && <b>{unit}</b>}
              </span>
              <TunnelExit id="label" />
            </div>

            <Aria.SliderTrack className={styles.track}>
              {({ state }) => (
                <PropsContextProvider
                  props={{
                    Button: {
                      isPending: false,
                      isFailed: false,
                      isSucceeded: false,
                      isReadOnly: isReadOnly,
                      excludeFromTabOrder: true,
                      isDisabled,
                      variant: "plain",
                      color: "secondary",
                    },
                  }}
                >
                  <Button
                    onPress={() => state.decrementThumb(0, step)}
                    aria-label={stringFormatter.format("slider.decrement")}
                    className={styles.decrement}
                    isDisabled={isDisabled}
                    variant="plain"
                    color="secondary"
                  >
                    <IconMinus />
                  </Button>

                  <Button
                    onPress={() => state.incrementThumb(0, step)}
                    aria-label={stringFormatter.format("slider.increment")}
                    className={styles.increment}
                    isDisabled={isDisabled}
                    variant="plain"
                    color="secondary"
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
                  <Aria.SliderThumb
                    inputRef={objectRef}
                    name={name}
                    className={styles.handle}
                    isDisabled={isReadOnly}
                  />
                </PropsContextProvider>
              )}
            </Aria.SliderTrack>
            <FieldErrorView />
          </PropsContextProvider>
        </TunnelProvider>
      </Aria.Slider>
    </div>
  );
});

export default Slider;
