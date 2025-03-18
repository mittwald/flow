import type { FC, PropsWithChildren, ReactElement } from "react";

export const Wrap: FC<{
  if: unknown;
  children: ReactElement<PropsWithChildren>;
}> = (props) => {
  const { if: _if, children } = props;

  if (_if) {
    return children;
  }

  return children.props.children;
};

export default Wrap;
