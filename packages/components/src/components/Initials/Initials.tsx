import type { PropsWithChildren } from "react";
import React from "react";
import { getInitialsFromString } from "./lib/getInitialsFromString";
import styles from "./Initials.module.scss";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";
import { onlyText } from "react-children-utilities";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";

export interface InitialsProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps {
  "aria-hidden"?: boolean;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Initials = flowComponent("Initials", (props) => {
  const { children, className, "aria-hidden": ariaHidden, ref } = props;

  const textContent = onlyText(children);
  const initials = getInitialsFromString(textContent);

  const rootClassName = clsx(styles.initials, className);

  const initialsElements = initials.map((initial, index) => (
    <span key={index}>{initial}</span>
  ));

  return (
    <ClearPropsContext>
      <div
        aria-hidden={ariaHidden}
        aria-label={textContent}
        className={rootClassName}
        ref={ref}
      >
        {initialsElements}
      </div>
    </ClearPropsContext>
  );
});

export default Initials;
