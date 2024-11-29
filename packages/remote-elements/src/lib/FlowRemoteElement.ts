import type { EmptyObject } from "type-fest";
import { RemoteElement } from "@remote-dom/core/elements";
import { FlowRemoteEvent } from "@mittwald/flow-remote-core";

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

  public addEventListener(
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
      const finalEvent =
        event instanceof FlowRemoteEvent ? (event.detail as Event) : event;
      return finalListener?.(finalEvent);
    };

    this.eventListenerMap.set(listener, wrappedEventListener);

    return super.addEventListener(type, wrappedEventListener, options);
  }

  public removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ) {
    const wrappedEventListener = this.eventListenerMap.get(listener);
    this.eventListenerMap.delete(listener);
    super.removeEventListener(type, wrappedEventListener ?? listener, options);
  }
}
