import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./FieldError.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";
import { IconDanger } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface FieldErrorProps
  extends PropsWithChildren<Omit<Aria.FieldErrorProps, "children">>,
    FlowComponentProps {}

export const FieldError = flowComponent("FieldError", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.fieldError, className);

  return (
    <ClearPropsContext>
      <Aria.FieldError {...rest} className={rootClassName} ref={ref}>
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
