import { page } from "vitest/browser";
import { type FC, type PropsWithChildren } from "react";

export const RootContainer: FC<PropsWithChildren> = (props) => (
  <div
    style={{
      width: "1280px",
      height: "720px",
      boxSizing: "border-box",
      padding: "32px",
    }}
    data-testid="root-container"
  >
    {props.children}
  </div>
);

export const rootContainerLocator = page.getByTestId("root-container");
