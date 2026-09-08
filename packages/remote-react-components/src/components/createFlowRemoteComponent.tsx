import type {
  RemoteComponentOptions,
  RemoteComponentTypeFromElementConstructor,
} from "@mittwald/remote-dom-react";
import {
  flowComponent,
  isFlowComponentName,
  OverlayHoistProvider,
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

/**
 * Components whose children the host renders inside an overlay that unmounts –
 * the `ContextMenu` popover, which closes as soon as a menu item is activated.
 * An overlay declared inside them is rendered as a **sibling** of the remote
 * element instead, so the host places it outside that popover and it survives
 * the menu closing. Same mechanism as on the host side, see
 * `OverlayHoistProvider`.
 */
const overlayHoistingComponents = new Set<string>(["ContextMenu"]);

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

  const hoistsOverlays = overlayHoistingComponents.has(flowComponentTag);

  if (isFlowComponentName(flowComponentTag)) {
    return flowComponent(
      flowComponentTag,
      (p) => {
        const remoteElement = createElement(element, p as never, p.children);
        return hoistsOverlays ? (
          <OverlayHoistProvider>{remoteElement}</OverlayHoistProvider>
        ) : (
          remoteElement
        );
      },
      {
        isRemoteComponent: true,
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
