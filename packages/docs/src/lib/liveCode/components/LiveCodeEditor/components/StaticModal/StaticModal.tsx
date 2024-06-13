import type { FC, PropsWithChildren } from "react";

export const StaticModal: FC<PropsWithChildren> = (props) => {
  return (
    <div className="flow--modal">
      <div>
        <section role="dialog">{props.children}</section>
      </div>
    </div>
  );
};
