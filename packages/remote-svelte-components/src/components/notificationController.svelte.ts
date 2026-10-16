import { getContext, setContext, type Snippet } from "svelte";

export interface NotificationOptions {
  /** Whether the notification closes itself after ten seconds. */
  autoClose?: boolean;
  /** Called when the notification is closed, however that happens. */
  onClose?: () => void;
}

export interface NotificationEntry {
  id: number;
  notification: Snippet;
  options: NotificationOptions;
  autoCloseTimeout?: ReturnType<typeof setTimeout>;
  autoCloseRemaining?: number;
  autoCloseStartedAt?: number;
}

const autoCloseAfter = 10_000;

/**
 * Holds the notifications an app has raised.
 *
 * Flow's controller is a MobX model; this one is a rune. The contract an
 * extension sees is the same: `add()` a notification, get an id back,
 * `remove()` it — and `autoClose` pauses while the pointer or the focus rests
 * on it, which is why the timer is tracked per entry rather than by the host.
 *
 * What differs from React and Vue: the notification is a **snippet**, and a
 * snippet cannot be inspected, so `autoClose` is passed alongside it instead of
 * being read off the element.
 */
export class NotificationController {
  readonly #entries = $state<NotificationEntry[]>([]);
  #nextId = 0;

  public get notifications(): NotificationEntry[] {
    return this.#entries;
  }

  public add(notification: Snippet, options: NotificationOptions = {}): number {
    const id = this.#nextId++;
    const entry: NotificationEntry = { id, notification, options };
    this.#entries.push(entry);

    if (options.autoClose) {
      this.#startAutoClose(entry, autoCloseAfter);
    }

    return id;
  }

  public remove(id: number): void {
    const index = this.#entries.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return;
    }
    clearTimeout(this.#entries[index]?.autoCloseTimeout);
    this.#entries.splice(index, 1);
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
    if (!entry.options.autoClose || entry.autoCloseTimeout) {
      return;
    }
    this.#startAutoClose(entry, entry.autoCloseRemaining ?? autoCloseAfter);
  }

  #startAutoClose(entry: NotificationEntry, delay: number): void {
    entry.autoCloseStartedAt = Date.now();
    entry.autoCloseRemaining = delay;
    entry.autoCloseTimeout = setTimeout(() => this.remove(entry.id), delay);
  }
}

const notificationControllerKey = Symbol.for(
  "flow.remote.svelte.notificationController",
);

export const setNotificationController = (
  controller: NotificationController,
): void => {
  setContext(notificationControllerKey, controller);
};

export const useNotificationController = (): NotificationController => {
  const controller = getContext<NotificationController | undefined>(
    notificationControllerKey,
  );

  if (!controller) {
    throw new Error(
      "useNotificationController() must be called inside a <NotificationProvider />",
    );
  }

  return controller;
};
