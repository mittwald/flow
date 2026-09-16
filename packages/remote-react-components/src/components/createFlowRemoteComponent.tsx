import type {
  RemoteComponentOptions,
  RemoteComponentTypeFromElementConstructor,
} from "@mittwald/remote-dom-react";
import type { FlowComponentProvisionType } from "@mittwald/flow-react-components/internal";
import {
  flowComponent,
  isFlowComponentName,
  useReportComponentUsage,
  ViewCompositionReset,
} from "@mittwald/flow-react-components/internal";
import type {
  RemoteElement,
  RemoteElementConstructor,
} from "@mittwald/flow-remote-core";
import { createElement, type FC } from "react";
import { createRemoteComponent } from "@/lib/createRemoteComponent";

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
    type,
  }: RemoteComponentOptions<ElementConstructor, Props> & {
    /*
     * The provision type of the component this stands in for. It has to travel
     * with the generated component, because `flowComponent` defaults to `"ui"`
     * — which wraps the element in a `ClearPropsContext` and cuts every props
     * context that a surrounding provider set. A trigger whose local
     * counterpart is not `@flr-generate` renders inside the remote tree
     * (`ModalTrigger` → `OverlayTrigger` → this element), so clearing there
     * drops the `onPress` its own trigger just supplied.
     */
    type?: FlowComponentProvisionType;
  } = {},
): RemoteComponentTypeFromElementConstructor<ElementConstructor> {
  const element = createRemoteComponent(tag, Element, {
    slotProps,
    eventProps,
  });

  if (isFlowComponentName(flowComponentTag)) {
    return flowComponent(
      flowComponentTag,
      (p) => {
        return createElement(element, p as never, p.children);
      },
      {
        isRemoteComponent: true,
        type,
      },
    ) as never;
  }

  const RemoteComponent: FC<AnyRecord> = (props) => {
    const isViewComposition = useReportComponentUsage(flowComponentTag);
    const remoteElement = createElement(
      element,
      props as never,
      props.children,
    );

    return isViewComposition ? (
      <ViewCompositionReset>{remoteElement}</ViewCompositionReset>
    ) : (
      remoteElement
    );
  };

  RemoteComponent.displayName = `FlowRemoteComponent(${flowComponentTag})`;

  return RemoteComponent as never;
}

export default createFlowRemoteComponent;
