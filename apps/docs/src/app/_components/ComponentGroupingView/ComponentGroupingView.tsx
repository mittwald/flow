import type { FC, PropsWithChildren } from "react";
import type { ComponentGrouping } from "@/app/_lib/componentGrouping";
import styles from "./ComponentGroupingView.module.scss";

interface Props extends PropsWithChildren {
  view: ComponentGrouping;
}

export const ComponentGroupingView: FC<Props> = (props) => (
  <div className={styles[props.view]}>{props.children}</div>
);

export default ComponentGroupingView;
