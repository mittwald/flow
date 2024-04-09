import type { FC, ReactElement } from "react";

export const Wrap: FC<{ if: unknown; children: ReactElement }> = (props) => {
  const { if: _if, children } = props;

  if (_if) {
    return children;
  }

  return children.props.children;
};
