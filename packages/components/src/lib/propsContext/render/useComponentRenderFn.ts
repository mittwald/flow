import type { FlowComponentName } from "@/components/propTypes";
import type { FlowRenderFn } from "@/lib/types/props";
import type { ComponentRenderContext } from "@/lib/propsContext/render/ComponentRenderContextProvider";
import { useComponentRenderContext } from "@/lib/propsContext/render/ComponentRenderContextProvider";
import { clone } from "remeda";

const findNextRenderFn = (
  componentName: FlowComponentName,
  ctx: ComponentRenderContext | undefined,
): FlowRenderFn<never> | undefined => {
  if (!ctx) {
    return;
  }

  if (typeof ctx.render[componentName] === "function") {
    const renderFn = ctx.render[componentName];
    return renderFn as unknown as FlowRenderFn<never>;
  }

  return findNextRenderFn(componentName, ctx.parentContext);
};

const deleteRenderFn = (
  componentName: FlowComponentName,
  renderFn: FlowRenderFn<never>,
  ctx: ComponentRenderContext | undefined,
): void => {
  if (!ctx) {
    return;
  }

  if (ctx.render[componentName] === renderFn) {
    delete ctx.render[componentName];
  }

  return deleteRenderFn(componentName, renderFn, ctx.parentContext);
};

export const useComponentRenderFn = (
  componentName: FlowComponentName,
): [FlowRenderFn<never>, ComponentRenderContext] | [undefined, undefined] => {
  const context = useComponentRenderContext();
  const renderFn = findNextRenderFn(componentName, context);

  if (renderFn && context) {
    const resultContext = clone(context);
    deleteRenderFn(componentName, renderFn, resultContext);
    return [renderFn, resultContext];
  }

  return [undefined, undefined];
};
