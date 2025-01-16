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
import { isFlowComponentName } from "@mittwald/flow-react-components/hooks";
import { flowComponent } from "@mittwald/flow-react-components/internal";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export function createFlowRemoteComponent<
  Tag extends keyof HTMLElementTagNameMap,
  ElementConstructor extends RemoteElementConstructor<
    AnyRecord,
    AnyRecord,
    AnyRecord,
    AnyRecord
  > = HTMLElementTagNameMap[Tag] extends RemoteElement<
    infer Properties,
    infer Methods,
    infer Slots,
    infer EventListeners
  >
    ? RemoteElementConstructor<Properties, Methods, Slots, EventListeners>
    : never,
  Props extends AnyRecord = AnyRecord,
>(
  tag: Tag,
  flowComponentTag: string,
  Element: ElementConstructor | undefined = customElements.get(tag) as never,
  {
    slotProps = true,
    eventProps = {} as never,
  }: RemoteComponentOptions<ElementConstructor, Props> = {},
): RemoteComponentTypeFromElementConstructor<ElementConstructor> {
  const element = createRemoteComponent(tag, Element, {
    slotProps,
    eventProps,
  });

  if (isFlowComponentName(flowComponentTag)) {
    return flowComponent(flowComponentTag, (p) => {
      return createElement(element, p as never);
    });
  }

  return element;
}

export default createFlowRemoteComponent;
