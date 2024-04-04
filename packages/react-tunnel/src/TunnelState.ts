import { ReactNode, useState } from "react";
import { action, makeObservable, observable } from "mobx";

type TunnelNodes = Record<string, ReactNode>;

const defaultId = "default";

export class TunnelState {
  public readonly children: TunnelNodes = {};

  public constructor() {
    makeObservable(this, {
      children: observable,
      deleteChildren: action.bound,
      setChildren: action.bound,
    });
  }

  public static useNew(): TunnelState {
    return useState(new TunnelState())[0];
  }

  public setChildren(tunnelId: string = defaultId, children: ReactNode): void {
    this.children[tunnelId] = children;
  }

  public deleteChildren(tunnelId: string = defaultId): void {
    delete this.children[tunnelId];
  }

  public hasChildren(tunnelId: string = defaultId): boolean {
    return tunnelId in this.children;
  }

  public getChildren(tunnelId: string = defaultId): ReactNode {
    return this.children[tunnelId];
  }
}
