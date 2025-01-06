import type { PropsWithChildren } from "react";
import { useId } from "react";
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

  const id = useId();

  const rootClassName = clsx(styles.fieldError, className);

  console.log("WOW", id, children, React.Children.count(children));

  return (
    <ClearPropsContext>
      {React.Children.count(children) >= 1 && (
        <Aria.FieldError {...rest} className={rootClassName} ref={ref}>
          <>
            <IconDanger size="s" />
            asd
            <span>asd{children}</span>
          </>
        </Aria.FieldError>
      )}
      {React.Children.count(children) === 0 && (
        <Aria.FieldError {...rest} className={rootClassName} ref={ref}>
          {({ validationErrors }) => {
            return (
              <>
                <IconDanger size="s" />
                asd2
                <span>{validationErrors.join(" ")}</span>
              </>
            );
          }}
        </Aria.FieldError>
      )}
    </ClearPropsContext>
  );
});

export default FieldError;
