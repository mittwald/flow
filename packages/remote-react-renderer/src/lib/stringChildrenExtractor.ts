import type { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { createElement, isValidElement } from "react";

interface RemoteReactElementProps {
  remote?: {
    data?: ReactNode;
  };
}

const extractRemoteTextRendererStrings = (node: ReactNode): ReactNode => {
  if (Array.isArray(node)) {
    return node.map((e) => extractRemoteTextRendererStrings(e)).join(" ");
  }

  if (
    isValidElement<RemoteReactElementProps>(node) &&
    typeof node.type === "function" &&
    node.type.name === "RemoteTextRenderer"
  ) {
    return extractRemoteTextRendererStrings(node.props.remote?.data);
  }

  return node;
};

export const stringChildrenExtractor =
  <P extends PropsWithChildren>(
    component: FunctionComponent<P>,
  ): FunctionComponent<P> =>
  (props) => {
    const extractedStrings = extractRemoteTextRendererStrings(props.children);

    return createElement<P>(
      component,
      props,
      Array.isArray(extractedStrings) ? extractedStrings[0] : extractedStrings,
    );
  };
