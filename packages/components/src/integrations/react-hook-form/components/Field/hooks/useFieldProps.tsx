import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import type { ForwardedFieldProps } from "@/integrations/react-hook-form/components/Field/Field";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import { mergeProps } from "@react-aria/utils";
import resolveDynamicProps from "@/lib/propsContext/dynamicProps/resolveDynamicProps";
import type { FieldPath, FieldValues } from "react-hook-form";
import { PropsContextProvider } from "@/lib/propsContext";
import DivView from "@/views/DivView";

export const FieldPropsContext = createContext<
  ForwardedFieldProps<never, never>
>({} as never);

export interface FieldPropsComponent<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>
  extends
    Omit<Partial<ForwardedFieldProps<T, TName>>, "children">,
    PropsWithChildren {}

export const useFieldProps = <T = unknown,>(
  props: PropsWithChildren<T>,
  isTextValueComponent = false,
) => {
  const contextProps = useContext(FieldPropsContext);
  const controlledProps = useControlledHostValueProps(contextProps);
  const finalPropsFromContext = isTextValueComponent
    ? controlledProps
    : contextProps;

  const mergedProps = mergeProps(
    props,
    finalPropsFromContext,
    resolveDynamicProps(finalPropsFromContext, props),
  ) as T & ForwardedFieldProps<never, never>;
  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } = useFieldComponent(mergedProps);

  const FieldComponentContainer: FC<PropsWithChildren> = useMemo(
    () =>
      ({ children, ...rest }) => (
        <DivView {...rest} {...fieldProps}>
          {children}
        </DivView>
      ),
    [fieldProps],
  );

  const FieldChildrenContainer: FC<PropsWithChildren> = useMemo(
    () =>
      ({ children }) => (
        <PropsContextProvider props={fieldPropsContext}>
          <FieldErrorCaptureContext>{children}</FieldErrorCaptureContext>
        </PropsContextProvider>
      ),
    [fieldPropsContext],
  );

  return {
    ...mergedProps,
    fieldComponents: {
      FieldComponentContainer,
      FieldChildrenContainer,
      FieldErrorView,
    },
  } as const;
};
