import { getObjectKeysIncludingProtoTypes } from "@/lib/getObjectKeysIncludingProtoTypes";
import {
  RemoteElement,
  RemoteEvent,
  type Version,
} from "@mittwald/flow-remote-core";
import { isArray, isObjectType, omit } from "remeda";
import type { EmptyObject } from "type-fest";

// eslint-disable-next-line
type ExplicitAny = any;

export class FlowRemoteElement<
  Properties extends Record<string, ExplicitAny> = EmptyObject,
  Methods extends Record<
    string,
    (...args: ExplicitAny[]) => void
  > = EmptyObject,
  Slots extends Record<string, ExplicitAny> = EmptyObject,
  EventListeners extends Record<string, ExplicitAny> = EmptyObject,
> extends RemoteElement<Properties, Methods, Slots, EventListeners> {
  private eventListenerMap = new Map<
    EventListenerOrEventListenerObject,
    EventListenerOrEventListenerObject
  >();

  /**
   * This property is used to check if the host component has received its
   * remote props. If not, rendering the underlying component is skipped.
   */
  public static initializationPropertyName = "data-flr-initialized" as const;

  public static versionPropertyName = "data-flr-version" as const;

  static override get remoteProperties() {
    return {
      ...super.remoteAttributes,
      [FlowRemoteElement.initializationPropertyName]: {},
      [FlowRemoteElement.versionPropertyName]: {},
    };
  }

  public override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void {
    const finalListener = listener
      ? "handleEvent" in listener
        ? listener.handleEvent
        : listener
      : null;

    const wrappedEventListener: EventListener = (event) => {
      let finalEvent = event;

      if (event instanceof RemoteEvent) {
        if (!isArray(event.detail) && isObjectType(event.detail)) {
          const propsToLiftUpFromDetails = omit(
            event.detail,
            getObjectKeysIncludingProtoTypes(event) as never,
          );
          Object.assign(event, propsToLiftUpFromDetails);
        } else {
          finalEvent = event.detail as never;
        }
      }

      return finalListener?.(finalEvent);
    };

    this.eventListenerMap.set(listener, wrappedEventListener);

    return super.addEventListener(type, wrappedEventListener, options);
  }

  public override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ) {
    const wrappedEventListener = this.eventListenerMap.get(listener);
    this.eventListenerMap.delete(listener);
    super.removeEventListener(type, wrappedEventListener ?? listener, options);
  }
}

export interface FlowRemoteElementMetaData {
  [FlowRemoteElement.initializationPropertyName]?: boolean;
  [FlowRemoteElement.versionPropertyName]?: Version;
}
