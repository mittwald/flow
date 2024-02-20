import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { FieldError } from "@/components/FieldError";
import styles from "./Select.module.scss";
import clsx from "clsx";

export interface SelectProps
  extends PropsWithChildren<
    Omit<Aria.ComboBoxProps<{ example: string }>, "children">
  > {}

export const Select: FC<SelectProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(formFieldStyles.formField, className);

  const propsContext: PropsContext = {
    Label: {
      className: formFieldStyles.label,
      optional: !props.isRequired,
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
    },
    FieldError: {
      className: formFieldStyles.customFieldError,
    },
  };

  return (
    <Aria.ComboBox menuTrigger="focus" {...rest} className={rootClassName}>
      <div className={styles.select}>
        <Aria.Input className={styles.input} />
        <Button>
          <Icon faIcon={faChevronDown} />
        </Button>
      </div>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={styles.fieldError} />
    </Aria.ComboBox>
  );
};

export default Select;
