import { action, makeObservable, observable } from "mobx";
import { useContext, useRef } from "react";
import useSelector from "~/lib/mobx/useSelector";
import { childPropsContext } from "~/lib/childProps/context";

export type ChildProps = object;

export class ChildPropsStore {
  public children = observable.map<string, ChildProps>({}, { deep: false });
  public readonly scope: string;

  public constructor(scope: string) {
    this.scope = scope;
    makeObservable(this, {
      children: observable.shallow,
      setProps: action,
      removeProps: action,
    });
  }

  public static useNew(scope: string): ChildPropsStore {
    return useRef(new ChildPropsStore(scope)).current;
  }

  public static useFromContext(scope: string): ChildPropsStore | undefined {
    return useContext(childPropsContext)[scope];
  }

  public static use(scope: string): ChildPropsStore {
    const fromContext = ChildPropsStore.useFromContext(scope);
    const newContext = ChildPropsStore.useNew(scope);
    return fromContext ?? newContext;
  }

  public setProps(childId: string, props: ChildProps): void {
    this.children.set(childId, props);
  }

  public removeProps(childId: string): void {
    this.children.delete(childId);
  }

  public getPropsArray<T>(): T[] {
    return Array.from(this.children.values()) as T[];
  }

  public getProp<T>(name: string): T | undefined {
    for (const childProps of this.getPropsArray<ChildProps>()) {
      if (name in childProps) {
        return childProps[name as keyof typeof childProps] as T;
      }
    }
  }

  public useProp<T>(name: string): T | undefined {
    return useSelector(() => this.getProp(name));
  }

  public useProps<T>(): T | undefined {
    return this.usePropsArray<T>()[0];
  }

  public usePropsArray<T>(): T[] {
    return useSelector(() => this.getPropsArray<T>());
  }
}
