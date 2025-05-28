import type {
  RemoteComponentRendererProps,
  RemoteTextRendererProps,
} from "@mittwald/remote-dom-react/host";
import { isObjectType, isString } from "remeda";

export function isRemoteComponentRendererProps(
  props: unknown,
): props is RemoteComponentRendererProps {
  return (
    isObjectType(props) &&
    "element" in props &&
    "components" in props &&
    "receiver" in props
  );
}

export function isRemoteTextRenderProps(
  props: unknown,
): props is RemoteTextRendererProps {
  return (
    isObjectType(props) &&
    "remote" in props &&
    isObjectType(props.remote) &&
    "data" in props.remote &&
    isString(props.remote.data)
  );
}
