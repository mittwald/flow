import clsx from "clsx";
import styles from "./Separator.module.scss";
import * as Aria from "react-aria-components";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface SeparatorProps
  extends Aria.SeparatorProps, FlowComponentProps<HTMLElement> {
  children?: never;
}

/**
 * Inside a collection (`ContextMenu`) a `tunnel` needs a `staticEntryId`, since
 * react-aria renders collection children twice (#3146).
 *
 * @flr-generate all
 */
export const Separator = flowComponent("Separator", (props) => {
  const { className, orientation = "horizontal", ...rest } = props;

  const rootClassName = clsx(
    styles.separator,
    orientation === "vertical" && styles.vertical,
    className,
  );

  return (
    <Aria.Separator elementType="hr" className={rootClassName} {...rest} />
  );
});

export default Separator;
