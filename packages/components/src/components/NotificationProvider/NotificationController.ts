import type { ReactNode } from "react";
import type { Status } from "@/lib/types/props";
import useSelector from "@/lib/mobx/useSelector";
import { action, makeObservable, observable } from "mobx";
import Timer from "@/lib/timer/Timer";

interface NotificationMetaData {
  readonly id: number;
  readonly createdAt: number;
  readonly autoCloseTimer: Timer;
}

export interface NotificationData {
  readonly heading: ReactNode;
  readonly text: ReactNode;
  readonly onClose?: () => void;
  readonly onClick?: () => void;
  readonly autoClose?: boolean;
  readonly status?: Status;

  readonly meta: NotificationMetaData;
}

type NotificationInputData = Omit<NotificationData, "meta">;

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

  public useNotifications(): NotificationData[] {
    return useSelector(() => Array.from(this.notificationsData.values()));
  }

  public add(data: NotificationInputData): void {
    const id = this.id++;

    const meta: NotificationMetaData = {
      id,
      createdAt: Date.now(),
      autoCloseTimer: new Timer(),
    };

    this.notificationsData.set(id, {
      ...data,
      meta,
    });

    if (data.autoClose) {
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
