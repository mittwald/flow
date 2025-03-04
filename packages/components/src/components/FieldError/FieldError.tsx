import { IconDanger } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./FieldError.module.scss";

export interface FieldErrorProps
  extends PropsWithChildren<Omit<Aria.FieldErrorProps, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const FieldError = flowComponent("FieldError", (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.fieldError, className);

  return (
    <ClearPropsContextView>
      <Aria.FieldError {...rest} className={rootClassName}>
        {({ validationErrors }) => (
          <>
            <IconDanger size="s" />
            <span>{children ? children : validationErrors.join(" ")}</span>
          </>
        )}
      </Aria.FieldError>
    </ClearPropsContextView>
  );
});

export default FieldError;
