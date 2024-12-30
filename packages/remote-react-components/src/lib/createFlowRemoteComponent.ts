import { createElement } from "react";
import type {
  RemoteElement,
  RemoteElementConstructor,
} from "@remote-dom/core/elements";
import type {
  RemoteComponentOptions,
  RemoteComponentTypeFromElementConstructor,
} from "@remote-dom/react";
import { createRemoteComponent } from "@remote-dom/react";
import { useProps } from "@mittwald/flow-react-components/hooks";

export function createFlowRemoteComponent<
  Tag extends keyof HTMLElementTagNameMap,
  ElementConstructor extends RemoteElementConstructor<
    any,
    any,
    any,
    any
  > = HTMLElementTagNameMap[Tag] extends RemoteElement<
    infer Properties,
    infer Methods,
    infer Slots,
    infer EventListeners
  >
    ? RemoteElementConstructor<Properties, Methods, Slots, EventListeners>
    : never,
  Props extends Record<string, any> = {},
>(
  tag: Tag,
  flowComponentTag: Parameters<typeof useProps>[0],
  Element: ElementConstructor | undefined = customElements.get(tag) as any,
  {
    slotProps = true,
    eventProps = {} as any,
  }: RemoteComponentOptions<ElementConstructor, Props> = {},
): RemoteComponentTypeFromElementConstructor<ElementConstructor> {
  const element = createRemoteComponent(tag, Element, {
    slotProps,
    eventProps,
  });

  return (props) => {
    const combinedProps = useProps(flowComponentTag, props);
    return createElement(element, combinedProps as never);
  };
}

export default createFlowRemoteComponent;
