import { ClearPropsContextContent } from "@/components/ClearPropsContext/components";
import ClearPropsContextContentView from "@/views/ClearPropsContextContentView";
import type { FC, PropsWithChildren } from "react";

export type ClearPropsContextProps = PropsWithChildren;

export const ClearPropsContext: FC<ClearPropsContextProps> = (props) => {
  const { children, ...restProps } = props;
  return (
    <ClearPropsContextContentView {...restProps}>
      <ClearPropsContextContent {...restProps}>
        {children}
      </ClearPropsContextContent>
    </ClearPropsContextContentView>
  );
};

export default ClearPropsContext;
