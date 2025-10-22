import React, { type PropsWithChildren } from "react";
import styles from "./Rating.module.scss";
import clsx from "clsx";
import * as Aria from "react-aria-components";
import { RatingSegment } from "@/components/Rating/components/RatingSegment";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";

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
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.rating,
    formFieldStyles.formField,
    styles[`size-${size}`],
    className,
  );

  const propsContext: PropsContext = {
    Label: {
      className: formFieldStyles.label,
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
    },
    FieldError: {
      className: formFieldStyles.customFieldError,
    },
  };

  return (
    <Aria.RadioGroup
      className={rootClassName}
      defaultValue={defaultValue.toString()}
      value={value || value === 0 ? value.toString() : undefined}
      {...rest}
    >
      {(renderProps) => (
        <PropsContextProvider props={propsContext}>
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
      )}
    </Aria.RadioGroup>
  );
});

export default Rating;
