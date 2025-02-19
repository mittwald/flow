import type { FC, PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "../../LiveCodeEditor.module.css";

export const StaticModal: FC<PropsWithChildren> = (props) => {
  return (
    <div className={clsx(styles.staticModal, "flow--modal")}>
      <div>
        <section role="dialog">{props.children}</section>
      </div>
    </div>
  );
};
