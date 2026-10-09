import type { ComponentProps, PropsWithChildren } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import type * as Aria from "react-aria-components";
import type { Key } from "react-aria-components";
import clsx from "clsx";
import styles from "./AccordionGroup.module.scss";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import {
  AccordionGroupContext,
  type AccordionGroupContextValue,
} from "@/components/AccordionGroup/context";
import {
  expandedKeysOf,
  initialExpansion,
  isKeyExpanded,
  nextExpandedKeys,
  setKeyExpanded,
} from "@/components/AccordionGroup/lib/expansion";

export interface AccordionGroupProps
  extends
    PropsWithChildren<
      Omit<
        ComponentProps<"div">,
        "defaultValue" | "onChange" | "ref" | "children"
      >
    >,
    Pick<
      Aria.DisclosureGroupProps,
      "expandedKeys" | "defaultExpandedKeys" | "onExpandedChange"
    >,
    FlowComponentProps {
  /**
   * Whether several accordions can be expanded at the same time. When false,
   * expanding one accordion collapses the others. Unlike React Aria's
   * `DisclosureGroup`, this defaults to `true`.
   *
   * @default true
   */
  allowsMultipleExpanded?: boolean;
  /**
   * Whether separators are drawn between the accordions.
   *
   * @default true
   */
  separators?: boolean;
}

const propsContext: PropsContext = {
  Accordion: {
    className: styles.accordion,
  },
};

/**
 * @flr-generate all
 * @flowStatus beta, new
 */
export const AccordionGroup = flowComponent(
  "AccordionGroup",
  (props) => {
    const {
      children,
      className,
      allowsMultipleExpanded = true,
      separators = true,
      expandedKeys,
      defaultExpandedKeys,
      onExpandedChange,
      ref,
      ...rest
    } = props;

    const [expansion, setExpansion] = useState(() =>
      initialExpansion(defaultExpandedKeys),
    );
    /*
     * Two toggles before the next render (a find match while another toggle
     * is pending) must build on each other, not on the rendered state.
     */
    const latestExpansion = useRef(expansion);
    const registeredAccordions = useRef(new Map<Key, boolean>());

    const register = useCallback((key: Key, isDefaultExpanded: boolean) => {
      registeredAccordions.current.set(key, isDefaultExpanded);
      return () => {
        registeredAccordions.current.delete(key);
      };
    }, []);

    const groupContext = useMemo((): AccordionGroupContextValue => {
      const controlledKeys =
        expandedKeys === undefined ? undefined : new Set(expandedKeys);

      return {
        isExpanded: (key, isDefaultExpanded) =>
          controlledKeys
            ? controlledKeys.has(key)
            : isKeyExpanded(expansion, key, isDefaultExpanded),
        setExpanded: (key, isExpanded) => {
          if (controlledKeys) {
            onExpandedChange?.(
              nextExpandedKeys(
                controlledKeys,
                key,
                isExpanded,
                allowsMultipleExpanded,
              ),
            );
            return;
          }
          const next = setKeyExpanded(
            latestExpansion.current,
            key,
            isExpanded,
            allowsMultipleExpanded,
          );
          latestExpansion.current = next;
          setExpansion(next);
          onExpandedChange?.(
            expandedKeysOf(next, registeredAccordions.current),
          );
        },
        register,
      };
    }, [
      expansion,
      expandedKeys,
      onExpandedChange,
      allowsMultipleExpanded,
      register,
    ]);

    const rootClassName = clsx(
      styles.accordionGroup,
      separators && styles.separators,
      className,
    );

    return (
      <div {...rest} ref={ref} className={rootClassName}>
        <AccordionGroupContext value={groupContext}>
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </AccordionGroupContext>
      </div>
    );
  },
  {
    type: "layout",
  },
);

export default AccordionGroup;
