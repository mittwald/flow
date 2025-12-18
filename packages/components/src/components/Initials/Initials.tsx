import { type PropsWithChildren, useMemo } from "react";
import { getInitialsFromString } from "./lib/getInitialsFromString";
import styles from "./Initials.module.scss";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { getColorFromInitials } from "@/components/Initials/lib/getColorFromInitials";
import { extractTextFromFirstChild } from "@/lib/react/remote";

export interface InitialsProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps {
  "aria-hidden"?: boolean;
  /** @internal */
  useDynamicColor?: boolean;
}

/** @flr-generate all */
export const Initials = flowComponent("Initials", (props) => {
  const {
    children,
    useDynamicColor = false,
    className,
    "aria-hidden": ariaHidden,
    ref,
  } = props;

  const textContent = extractTextFromFirstChild(children) ?? "";
  const initials = getInitialsFromString(textContent);
  const dynamicColor = useMemo(
    () => (useDynamicColor ? getColorFromInitials(textContent) : undefined),
    [useDynamicColor, textContent],
  );

  const rootClassName = clsx(styles.initials, className);

  const initialsElements = initials.map((initial, index) => (
    <span key={index}>{initial}</span>
  ));

  return (
    <div
      data-dynamic-color={dynamicColor}
      aria-hidden={ariaHidden}
      aria-label={textContent}
      className={rootClassName}
      ref={ref}
    >
      {initialsElements}
    </div>
  );
});

export default Initials;
