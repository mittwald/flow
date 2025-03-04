import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { onlyText } from "react-children-utilities";
import styles from "./Initials.module.scss";
import { getInitialsFromString } from "./lib/getInitialsFromString";

export interface InitialsProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps {
  "aria-hidden"?: boolean;
}

/** @flr-generate all */
export const Initials = flowComponent("Initials", (props) => {
  const { children, className, "aria-hidden": ariaHidden, ref } = props;

  const textContent = onlyText(children);
  const initials = getInitialsFromString(textContent);

  const rootClassName = clsx(styles.initials, className);

  const initialsElements = initials.map((initial, index) => (
    <span key={index}>{initial}</span>
  ));

  return (
    <ClearPropsContextView>
      <div
        aria-hidden={ariaHidden}
        aria-label={textContent}
        className={rootClassName}
        ref={ref}
      >
        {initialsElements}
      </div>
    </ClearPropsContextView>
  );
});

export default Initials;
