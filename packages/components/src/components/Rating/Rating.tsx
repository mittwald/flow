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
  extends FlowComponentProps,
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
    FieldErrorResetContext,
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

  return (
    <Aria.RadioGroup
      {...rest}
      className={rootClassName}
      defaultValue={defaultValue.toString()}
      value={value || value === 0 ? value.toString() : undefined}
      ref={localRef}
    >
      {(renderProps) => (
        <>
          <FieldErrorResetContext>
            <PropsContextProvider props={fieldPropsContext}>
              {children}
              <div className={styles.ratingSegments}>
                {Array(5)
                  .fill("")
                  .map((_, index) => (
                    <RatingSegment
                      key={index}
                      index={index}
                      selectedValue={parseInt(
                        renderProps.state.selectedValue ?? "0",
                      )}
                      size={size}
                    />
                  ))}
              </div>
            </PropsContextProvider>
          </FieldErrorResetContext>
          <FieldErrorView />
        </>
      )}
    </Aria.RadioGroup>
  );
});

export default Rating;
