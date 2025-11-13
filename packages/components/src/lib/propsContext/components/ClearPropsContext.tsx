import {
  PropsContextProvider,
  usePropsContext,
} from "@/lib/propsContext/propsContext";
import { PropsContextLevelProvider } from "@/lib/propsContext/inherit/PropsContextLevelProvider";
import { useMemo, type FC, type PropsWithChildren } from "react";
import type { FlowComponentName } from "@/components/propTypes";
import type { PropsContext } from "@/index/internal";

export interface ClearPropsContextProps extends PropsWithChildren {
  keep?: FlowComponentName;
}

export const ClearPropsContext: FC<ClearPropsContextProps> = (props) => {
  const { children, keep } = props;

  const parentPropsContext = usePropsContext();

  const withKeptComponentProps: PropsContext = useMemo(
    () => (keep ? parentPropsContext[keep] : undefined) ?? {},
    [keep, parentPropsContext],
  );

  return (
    <PropsContextLevelProvider mode="reset">
      <PropsContextProvider value={withKeptComponentProps}>
        {children}
      </PropsContextProvider>
    </PropsContextLevelProvider>
  );
};

export default ClearPropsContext;
