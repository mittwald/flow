import { FlowComponentName, FlowComponentProps } from "@/components/propTypes";
import { mergeProps } from "@react-aria/utils";
import { resolveDynamicProps } from "@/lib/propsContext/dynamicProps/resolveDynamicProps";
import { useContext } from "react";
import { propsContext } from "@/lib/propsContext/propsContext";

export const useProps = <C extends FlowComponentName>(
  component: C,
  localProps: FlowComponentProps<C>,
): FlowComponentProps<C> => {
  const componentContextProps = useContext(propsContext)[component];

  const resolvedComponentContextProps = componentContextProps
    ? resolveDynamicProps(componentContextProps, localProps)
    : undefined;

  return mergeProps(
    resolvedComponentContextProps,
    localProps,
  ) as FlowComponentProps<C>;
};

export default useProps;
