import type {
  RemoteComponentOptions,
  RemoteComponentTypeFromElementConstructor,
} from "@mfalkenberg/remote-dom-react";
import { createRemoteComponent } from "@mfalkenberg/remote-dom-react";
import {
  ClearPropsContext,
  flowComponent,
  isFlowComponentName,
} from "@mittwald/flow-react-components/internal";
import type {
  RemoteElement,
  RemoteElementConstructor,
} from "@mittwald/flow-remote-core";
import { createElement } from "react";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

interface Options {
  clearPropsContext?: boolean;
}

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
  options: Options,
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
      const children = options.clearPropsContext ? (
        <ClearPropsContext>{p.children}</ClearPropsContext>
      ) : (
        p.children
      );

      return createElement(element, p as never, children);
    });
  }

  return element;
}

export default createFlowRemoteComponent;
