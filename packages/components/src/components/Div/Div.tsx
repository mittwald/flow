import type { FC, PropsWithChildren, Ref } from "react";
import type { PropsWithClassName } from "@/lib/types/props";

export interface DivProps extends PropsWithChildren, PropsWithClassName {
  ref?: Ref<HTMLDivElement>;
}

/** @flr-generate all */
export const Div: FC<DivProps> = (props) => {
  const { children, ...restProps } = props;
  return <div {...restProps}>{children}</div>;
};

export default Div;
