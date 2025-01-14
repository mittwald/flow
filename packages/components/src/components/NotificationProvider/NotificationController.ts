import type { ReactElement } from "react";
import { useRef } from "react";
import useSelector from "~/lib/mobx/useSelector";
import { action, makeObservable, observable } from "mobx";
import Timer from "~/lib/timer/Timer";
import type { NotificationProps } from "~/components/Notification";

interface NotificationMetaData {
  readonly id: number;
  readonly createdAt: number;
  readonly autoCloseTimer: Timer;
}

export interface NotificationData {
  readonly element: ReactElement<NotificationProps>;
  readonly meta: NotificationMetaData;
}

export class NotificationController {
  public readonly notificationsData = new Map<number, NotificationData>();
  private id = 0;

  public constructor() {
    makeObservable(this, {
      notificationsData: observable.shallow,
      add: action.bound,
      remove: action.bound,
    });
  }

  public static useNew(): NotificationController {
    return useRef(new NotificationController()).current;
  }

  public useNotifications(): NotificationData[] {
    return useSelector(() => Array.from(this.notificationsData.values()));
  }

  public add(notification: ReactElement<NotificationProps>): void {
    const id = this.id++;

    const meta: NotificationMetaData = {
      id,
      createdAt: Date.now(),
      autoCloseTimer: new Timer(),
    };

    this.notificationsData.set(id, {
      element: notification,
      meta,
    });

    if (notification.props.autoClose) {
      meta.autoCloseTimer.start({ seconds: 10 }, () => {
        this.remove(id);
      });
    }
  }

  public remove(id: number): void {
    this.notificationsData.delete(id);
  }
}

export default NotificationController;
