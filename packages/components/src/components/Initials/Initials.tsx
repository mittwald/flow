import React, { PropsWithChildren } from "react";
import { getInitialsFromString } from "./lib/getInitialsFromString";
import styles from "./Initials.module.scss";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";
import { onlyText } from "react-children-utilities";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface InitialsProps extends PropsWithChildren, FlowComponentProps {
  className?: string;
}

export const Initials = flowComponent("Initials", (props) => {
  const { children, className } = props;

  const textContent = onlyText(children);
  const initials = getInitialsFromString(textContent);

  const rootClassName = clsx(styles.initials, className);

  const initialsElements = initials.map((initial, index) => (
    <span key={index}>{initial}</span>
  ));

  return (
    <ClearPropsContext>
      <div aria-label={textContent} className={rootClassName}>
        {initialsElements}
      </div>
    </ClearPropsContext>
  );
});

export default Initials;
