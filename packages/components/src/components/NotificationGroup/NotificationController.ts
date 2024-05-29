import type { ReactNode } from "react";
import { useRef } from "react";
import type { Status } from "@/lib/types/props";
import useSelector from "@/lib/mobx/useSelector";
import { action, makeObservable, observable } from "mobx";

export interface NotificationData {
  id: string;
  heading: ReactNode;
  text: ReactNode;
  onClose?: () => void;
  onClick?: () => void;
  status?: Status;
}

export class NotificationController {
  public notificationList: NotificationData[];

  public constructor() {
    makeObservable(this, {
      notificationList: observable,
      add: action.bound,
      remove: action.bound,
    });
    this.notificationList = [];
  }

  public static useNew() {
    return useRef(new NotificationController()).current;
  }

  public useNotificationList(): NotificationData[] {
    return useSelector(() => this.notificationList);
  }

  public add(notification: NotificationData): void {
    this.notificationList = [notification, ...this.notificationList];
  }

  public remove(notificationId: string): void {
    this.notificationList = this.notificationList.filter(
      (e) => e.id !== notificationId,
    );
  }
}

export default NotificationController;
