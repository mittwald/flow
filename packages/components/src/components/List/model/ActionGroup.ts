import type { ReactNode } from "react";

export class ActionGroup {
  public readonly children?: ReactNode;

  public constructor(children: ReactNode) {
    this.children = children;
  }
}

export interface ActionGroupShape {
  children?: ReactNode;
}
