import type { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { isValidElement } from "react";
import { createElement } from "react";
import { deepFind } from "react-children-utilities";

interface RemoteTextElementProps {
  remote: {
    data: string;
  };
}

export const stringChildrenExtractor =
  <P extends PropsWithChildren>(component: FunctionComponent<P>) =>
  (props: PropsWithChildren<P>) => {
    let children = props.children;

    const remoteTextElement = deepFind(
      children,
      (child) =>
        isValidElement(child) &&
        typeof child.type === "function" &&
        child.type.name === "RemoteTextRenderer",
    );

    if (remoteTextElement) {
      children = (remoteTextElement as ReactElement<RemoteTextElementProps>)
        .props.remote.data;
    }

    return createElement<P>(
      component,
      props,
      Array.isArray(children) ? children[0] : children,
    );
  };
