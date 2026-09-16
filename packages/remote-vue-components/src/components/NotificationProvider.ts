import {
  cloneVNode,
  defineComponent,
  Fragment,
  h,
  inject,
  provide,
  shallowReactive,
  type InjectionKey,
  type VNode,
} from "vue";

interface NotificationEntry {
  id: number;
  element: VNode;
  autoCloseTimeout?: ReturnType<typeof setTimeout>;
  autoCloseRemaining?: number;
  autoCloseStartedAt?: number;
}

const autoCloseAfter = 10_000;

/**
 * Holds the notifications an app has raised.
 *
 * Flow's controller is a MobX model; this one is a reactive array. The contract
 * an extension sees is the same: `add()` a notification, get an id back,
 * `remove()` it — and `autoClose` pauses while the pointer or the focus rests
 * on it, which is why the timer is tracked per entry rather than by the host.
 */
export class NotificationController {
  private readonly entries = shallowReactive<NotificationEntry[]>([]);
  private nextId = 0;

  public get notifications(): NotificationEntry[] {
    return this.entries;
  }

  public add(notification: VNode): number {
    const id = this.nextId++;
    const entry: NotificationEntry = { id, element: notification };
    this.entries.push(entry);

    if (notification.props?.autoClose) {
      this.startAutoClose(entry, autoCloseAfter);
    }

    return id;
  }

  public remove(id: number): void {
    const index = this.entries.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return;
    }
    clearTimeout(this.entries[index]?.autoCloseTimeout);
    this.entries.splice(index, 1);
  }

  public pauseAutoClose(entry: NotificationEntry): void {
    if (entry.autoCloseTimeout === undefined) {
      return;
    }
    clearTimeout(entry.autoCloseTimeout);
    entry.autoCloseTimeout = undefined;
    entry.autoCloseRemaining = Math.max(
      0,
      (entry.autoCloseRemaining ?? autoCloseAfter) -
        (Date.now() - (entry.autoCloseStartedAt ?? Date.now())),
    );
  }

  public resumeAutoClose(entry: NotificationEntry): void {
    if (!entry.element.props?.autoClose || entry.autoCloseTimeout) {
      return;
    }
    this.startAutoClose(entry, entry.autoCloseRemaining ?? autoCloseAfter);
  }

  private startAutoClose(entry: NotificationEntry, delay: number): void {
    entry.autoCloseStartedAt = Date.now();
    entry.autoCloseRemaining = delay;
    entry.autoCloseTimeout = setTimeout(() => this.remove(entry.id), delay);
  }
}

const notificationControllerKey: InjectionKey<NotificationController> = Symbol(
  "flowNotificationController",
);

export const useNotificationController = (): NotificationController => {
  const controller = inject(notificationControllerKey, undefined);

  if (!controller) {
    throw new Error(
      "useNotificationController() must be called inside a <NotificationProvider />",
    );
  }

  return controller;
};

/**
 * Renders the app's notifications and hands its controller to everything below.
 *
 * The container is not a separate element: the notifications are remote
 * `Notification` components, and the host's own container is what positions
 * them.
 */
export const NotificationProvider = defineComponent({
  name: "NotificationProvider",

  setup(_props, { slots }) {
    const controller = new NotificationController();
    provide(notificationControllerKey, controller);

    return () => [
      h(
        Fragment,
        controller.notifications.map((entry) =>
          cloneVNode(entry.element, {
            key: entry.id,
            onMouseEnter: () => controller.pauseAutoClose(entry),
            onMouseLeave: () => controller.resumeAutoClose(entry),
            onFocus: () => controller.pauseAutoClose(entry),
            onBlur: () => controller.resumeAutoClose(entry),
            onClose: () => {
              controller.remove(entry.id);
              (entry.element.props?.onClose as (() => void) | undefined)?.();
            },
          }),
        ),
      ),
      slots.default?.(),
    ];
  },
});

export default NotificationProvider;
