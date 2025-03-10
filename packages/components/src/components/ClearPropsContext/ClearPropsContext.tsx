import { ClearPropsContextContent } from "@/components/ClearPropsContext/components";
import ClearPropsContextContentView from "@/views/ClearPropsContextContentView";
import type { FC, PropsWithChildren } from "react";

export type ClearPropsContextProps = PropsWithChildren;

export const ClearPropsContext: FC<ClearPropsContextProps> = (props) => {
  const { children, ...restProps } = props;
  return (
    <ClearPropsContextContent {...restProps}>
      <ClearPropsContextContentView {...restProps}>
        {children}
      </ClearPropsContextContentView>
    </ClearPropsContextContent>
  );
};

export default ClearPropsContext;
