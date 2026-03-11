import { createContext, type PropsWithChildren, useContext } from "react";
import type { ForwardedFieldProps } from "@/integrations/react-hook-form/components/Field/Field";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import { mergeProps } from "@react-aria/utils";
import resolveDynamicProps from "@/lib/propsContext/dynamicProps/resolveDynamicProps";
import type { FieldPath, FieldValues } from "react-hook-form";

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
  const fieldComponentProps = useFieldComponent(mergedProps);

  return {
    ...mergedProps,
    fieldComponentProps,
  } as const;
};
