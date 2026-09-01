import * as Aria from "react-aria-components";
import type { ComponentProps, FC } from "react";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export type DialogTriggerProps = ComponentProps<typeof Aria.DialogTrigger> &
  FlowComponentProps;

/*
 * `OverlayTrigger` pins the trigger button in the local tree, but its props
 * context does not reach the host: `ModalTrigger`, `PopoverTrigger` and
 * `LightBoxTrigger` are not `@flr-generate`, so a remote tree emits this
 * trigger's view and the host materialises a `DialogTrigger` with no
 * `OverlayTrigger` around it. Pinning the button here is what makes the
 * invariant hold on both sides — see `overlayTriggersTunneledTo`.
 */
const propsContext: PropsContext = {
  Button: {
    tunnel: null,
  },
};

/**
 * @flr-generate all
 * @flr-provider
 */
export const DialogTrigger: FC<DialogTriggerProps> = flowComponent(
  "DialogTrigger",
  (props) => {
    const { children, ...rest } = props;

    return (
      <Aria.DialogTrigger {...rest}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </Aria.DialogTrigger>
    );
  },
  { type: "provider" },
);

export default DialogTrigger;
