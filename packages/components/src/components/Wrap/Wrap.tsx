import type { FC, PropsWithChildren, ReactElement } from "react";

export interface WrapProps {
  /**
   * Whether the child element is rendered. Any truthy value keeps it, a falsy
   * one renders only its children.
   */
  if: unknown;
  /** The element that wraps the content, with the content as its children. */
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
