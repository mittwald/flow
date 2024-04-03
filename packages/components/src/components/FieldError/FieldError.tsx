import React, { PropsWithChildren } from "react";
import styles from "./FieldError.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";
import { IconDanger } from "@/components/Icon/components/icons";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface FieldErrorProps
  extends PropsWithChildren<Omit<Aria.FieldErrorProps, "children">>,
    FlowComponentProps {}

export const FieldError = flowComponent("FieldError", (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.fieldError, className);

  return (
    <ClearPropsContext>
      <Aria.FieldError {...rest} className={rootClassName}>
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
