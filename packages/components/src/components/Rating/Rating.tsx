import React, { type PropsWithChildren } from "react";
import styles from "./Rating.module.scss";
import clsx from "clsx";
import * as Aria from "react-aria-components";
import { RatingSegment } from "@/components/Rating/components/RatingSegment";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { PropsContextProvider } from "@/lib/propsContext";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";

export interface RatingProps
  extends
    FlowComponentProps,
    PropsWithChildren,
    Omit<Aria.RadioGroupProps, "children" | "value" | "defaultValue"> {
  /** The value sets the amount of filled stars. @default: 0 */
  value?: number;
  /** The defaultValue sets the amount of default filled stars. @default: 0 */
  defaultValue?: number;
  /** The size of the component. @default: "m" */
  size?: "s" | "m";
}

/** @flr-generate all */
export const Rating = flowComponent("Rating", (props) => {
  const {
    value,
    defaultValue = 0,
    size = "m",
    className,
    children,
    ref,
    ...rest
  } = props;

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props);

  const rootClassName = clsx(
    styles.rating,
    styles[`size-${size}`],
    fieldProps.className,
    className,
  );

  const localRef = useObjectRef(ref);
  useMakeFocusable(localRef);

  const stringValue = value?.toString();

  return (
    <Aria.RadioGroup
      {...rest}
      className={rootClassName}
      defaultValue={defaultValue.toString()}
      value={stringValue}
      ref={localRef}
    >
      {(renderProps) => (
        <>
          <FieldErrorCaptureContext>
            <PropsContextProvider props={fieldPropsContext}>
              {children}
              <div className={styles.ratingSegments}>
                {Array(5)
                  .fill("")
                  .map((_, index) => {
                    const selectedValue = parseInt(
                      renderProps.state.selectedValue ?? "0",
                    );

                    return (
                      <RatingSegment
                        key={index}
                        index={index}
                        selectedValue={selectedValue}
                        size={size}
                      />
                    );
                  })}
              </div>
            </PropsContextProvider>
          </FieldErrorCaptureContext>
          <FieldErrorView />
        </>
      )}
    </Aria.RadioGroup>
  );
});

export default Rating;
