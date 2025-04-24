import type { FC, PropsWithChildren, ReactElement } from "react";

export interface WrapProps {
  if: unknown;
  children: ReactElement<PropsWithChildren>;
}

export const Wrap: FC<WrapProps> = (props) => {
  const { if: _if, children } = props;

  if (_if) {
    return children;
  }

  return children.props.children;
};

export default Wrap;
