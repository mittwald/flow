import type { FC, PropsWithChildren } from "react";
import React from "react";
import { useOverlayController } from "@/lib/controller";
import { OverlayContextProvider } from "@/lib/controller/overlay/context";
import { Action } from "@/components/Action";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

type Props = PropsWithChildren;

export const OverlayTrigger: FC<Props> = (props) => {
  const overlayController = useOverlayController();

  const propsContext: PropsContext = {
    Button: {
      render: (Button, props) => (
        <Action openOverlay={overlayController}>
          <Button {...props} />
        </Action>
      ),
    },
  };

  return (
    <OverlayContextProvider value={overlayController}>
      <PropsContextProvider props={propsContext}>
        {props.children}
      </PropsContextProvider>
    </OverlayContextProvider>
  );
};
