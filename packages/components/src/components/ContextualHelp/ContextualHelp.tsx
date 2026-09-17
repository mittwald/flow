import type { PopoverProps } from "@/components/Popover/Popover";
import { Popover } from "@/components/Popover/Popover";
import styles from "./ContextualHelp.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useOverlayController } from "@/lib/controller";

export type ContextualHelpProps = Omit<PopoverProps, "withTip">;

/** @flr-generate all */
export const ContextualHelp = flowComponent("ContextualHelp", (props) => {
  const {
    children,
    controller: controllerFromProps,
    ref: ignoredRef,
    ...rest
  } = props;

  const controllerFromContext = useOverlayController("ContextualHelp", {
    reuseControllerFromContext: true,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  const propsContext: PropsContext = {
    // A contextual help holds a single, simple explanation — it does not need
    // its own heading structure. A heading is rendered as a bold text label
    // instead of an actual heading element.
    Heading: {
      level: 5,
      elementType: "span",
    },
  };

  return (
    <Popover withTip {...rest} controller={controller}>
      <PropsContextProvider props={propsContext}>
        <div className={styles.contextualHelp}>{children}</div>
      </PropsContextProvider>
    </Popover>
  );
});

export default ContextualHelp;
