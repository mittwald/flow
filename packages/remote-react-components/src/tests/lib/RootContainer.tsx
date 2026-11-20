import { page } from "vitest/browser";
import { type FC, type PropsWithChildren } from "react";
import { NotificationProvider } from "@mittwald/flow-react-components";

interface Props extends PropsWithChildren {
  /** Lets a scenario start with the focus on the container. */
  isFocusable?: boolean;
}

export const RootContainer: FC<Props> = (props) => (
  <div
    style={{
      width: "1280px",
      height: "720px",
      boxSizing: "border-box",
      padding: "32px",
      outline: "none",
    }}
    tabIndex={props.isFocusable ? -1 : undefined}
    data-testid="root-container"
  >
    <NotificationProvider>{props.children}</NotificationProvider>
  </div>
);

export const rootContainerLocator = page.getByTestId("root-container");
