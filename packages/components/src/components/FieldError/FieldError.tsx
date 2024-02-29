import React, { FC, PropsWithChildren } from "react";
import styles from "./FieldError.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";
import { IconDanger } from "@/components/Icon/components/icons";

export interface FieldErrorProps
  extends PropsWithChildren<Omit<Aria.FieldErrorProps, "children">> {}

export const FieldError: FC<FieldErrorProps> = (props) => {
  const { children, className, ...rest } = useProps("FieldError", props);

  const rootClassName = clsx(styles.fieldError, className);

  return (
    <Aria.FieldError {...rest} className={rootClassName}>
      {({ validationErrors }) => (
        <>
          <IconDanger size="s" />
          {children ? children : validationErrors.join(" ")}
        </>
      )}
    </Aria.FieldError>
  );
};

export default FieldError;
