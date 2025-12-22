import { page } from "vitest/browser";
import { type FC, type PropsWithChildren } from "react";
import { NotificationProvider } from "@mittwald/flow-react-components";

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
    <NotificationProvider>{props.children}</NotificationProvider>
  </div>
);

export const rootContainerLocator = page.getByTestId("root-container");
