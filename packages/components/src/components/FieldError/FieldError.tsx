import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./FieldError.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import { IconDanger } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface FieldErrorProps
  extends PropsWithChildren<Omit<Aria.FieldErrorProps, "children">>,
    FlowComponentProps {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const FieldError = flowComponent("FieldError", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.fieldError, className);

  return (
    <ClearPropsContext>
      <Aria.FieldError ref={ref} {...rest} className={rootClassName}>
        {({ validationErrors }) => (
          <>
            <IconDanger size="s" />
            <span>{children ? children : validationErrors.join(" ")}</span>
          </>
        )}
      </Aria.FieldError>
    </ClearPropsContext>
  );
});

export default FieldError;
