import {
  createElement,
  FunctionComponent,
  FunctionComponentElement,
  PropsWithChildren,
  ReactElement,
} from "react";
import { isArray } from "remeda";

const extractRemoteTextRendererStrings = (object: string | any | any[]): string | undefined => {
  if (typeof object === 'string') {
    return object;

  } else if ("type" in object && "name" in object.type && object.type.name === "RemoteTextRenderer") {
    return extractRemoteTextRendererStrings((object as ReactElement<any>).props.remote.data);

  } else if (Array.isArray(object)) {
    return object.map(e => extractRemoteTextRendererStrings(e)).join(' ');
  }

  return undefined;
}

export const stringChildrenExtractor = <P extends Record<string, unknown>>(component: FunctionComponent) => (props: PropsWithChildren<P>): FunctionComponentElement<P> => {
  const extractedStrings = extractRemoteTextRendererStrings(props.children);
  if(typeof extractedStrings === "string") {
    return createElement<P>(component, {
      ...props,
      children: extractedStrings,
    })
  }

  const children = props.children;
  return createElement<P>(component, {
    ...props,
    children: isArray(children) && children.length >= 1 ? children[0] : children,
  });
}