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
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import { useObjectRef } from "@react-aria/utils";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { UiComponentTunnelExit } from "../UiComponentTunnel/UiComponentTunnelExit";

export interface SliderProps
  extends
    FlowComponentProps<HTMLInputElement>,
    PropsWithChildren<Aria.SliderProps>,
    Pick<Aria.SliderThumbProps, "name"> {
  /** Whether the marker for the initial value should be visible */
  showInitialMarker?: boolean;
  /** Whether the component is read only. */
  isReadOnly?: boolean;
  /** Whether the component is invalid. */
  isInvalid?: boolean;
  /** Hide Buttons, Label and Value */
  sliderOnly?: boolean;
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
    sliderOnly,
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
  } = useFieldComponent(props, "Slider");

  const stringFormatter = useLocalizedStringFormatter(locales, "Slider");

  const objectRef = useObjectRef(ref);

  const propsContext: PropsContext = {
    ...fieldPropsContext,
    Label: {
      tunnel: {
        id: "label",
        component: "Slider",
      },
      ...fieldPropsContext.Label,
      className: styles.label,
    },
  };

  return (
    <div {...fieldProps}>
      <Aria.Slider
        {...rest}
        className={rootClassName}
        isDisabled={isDisabled}
        defaultValue={defaultValue}
        step={step}
      >
        <PropsContextProvider props={propsContext}>
          <FieldErrorCaptureContext>{children}</FieldErrorCaptureContext>

          {!sliderOnly && (
            <div className={styles.text}>
              <Aria.SliderOutput className={styles.value} />{" "}
              <UiComponentTunnelExit id="label" component="Slider" />
            </div>
          )}

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
                    size: "s",
                  },
                }}
              >
                {!sliderOnly && (
                  <>
                    <Button
                      onPress={() => state.decrementThumb(0, step)}
                      aria-label={stringFormatter.format("decrement")}
                      className={styles.decrement}
                    >
                      <IconMinus />
                    </Button>
                    <Button
                      onPress={() => state.incrementThumb(0, step)}
                      aria-label={stringFormatter.format("increment")}
                      className={styles.increment}
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
      </Aria.Slider>
    </div>
  );
});

export default Slider;
