import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from "react";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import ClearPropsContext from "@/lib/propsContext/components/ClearPropsContext";
import { useProps } from "@/lib/hooks/useProps";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import type { FlowComponentName } from "@/components/propTypes";
import { FieldErrorRenderedContext } from "@/lib/hooks/fieldErrorRenderedContext";

export interface UseFieldErrorOptions {
  fieldErrorId: string;
  tunnelId?: string;
  component: FlowComponentName;
}

export const useFieldError = (options: UseFieldErrorOptions) => {
  const fieldErrorProps = useProps("FieldError", {});
  const currentTunnelId = fieldErrorProps.tunnel?.id;
  const tunnelId =
    options.tunnelId ?? currentTunnelId ?? `${options.fieldErrorId}.fieldError`;

  const fieldErrorCapturePropsContext: PropsContext = {
    FieldError: {
      id: options.fieldErrorId,
      tunnel: { id: tunnelId, component: options.component },
      className: formFieldStyles.fieldError,
    },
  };

  const [renderedFieldErrorId, setRenderedFieldErrorId] = useState<string>();

  const FieldErrorCaptureContext: FC<PropsWithChildren> = useMemo(
    () => (props) => {
      return (
        <PropsContextProvider
          props={fieldErrorCapturePropsContext}
          dependencies={[tunnelId]}
        >
          {props.children}
        </PropsContextProvider>
      );
    },
    [tunnelId],
  );

  // Keep the component identity stable: a new one per render makes React
  // remount the error on every render of the field (each keystroke).
  const FieldErrorView: FC = useMemo(
    () => () => {
      if (currentTunnelId) {
        return null;
      }

      return (
        <FieldErrorRenderedContext value={setRenderedFieldErrorId}>
          <UiComponentTunnelExit id={tunnelId} component={options.component}>
            {(children) => {
              const childrenArray = React.Children.toArray(children);
              return <ClearPropsContext>{childrenArray[0]}</ClearPropsContext>;
            }}
          </UiComponentTunnelExit>
        </FieldErrorRenderedContext>
      );
    },
    [currentTunnelId, tunnelId, options.component],
  );

  return {
    FieldErrorCaptureContext,
    FieldErrorView,
    /**
     * The id of the error while one is rendered for this field. A nested field
     * (a `Checkbox` inside a `CheckboxButton`) renders its error at the outer
     * one, so only the outer field ever gets an id here.
     */
    renderedFieldErrorId,
  } as const;
};
