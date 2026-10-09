import type { ComponentProps, FC, PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useId, useRef } from "react";
import { useDisclosure } from "react-aria";
import { useDisclosureState } from "react-stately";
import clsx from "clsx";
import styles from "./Accordion.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { Button, type ButtonProps } from "@/components/Button";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";
import {
  AccordionGroupContext,
  useAccordionGroupContext,
} from "@/components/AccordionGroup/context";

export interface AccordionProps extends PropsWithChildren<
  ComponentProps<"div">
> {
  /**
   * The key of the accordion inside an `AccordionGroup`, used by its
   * `expandedKeys`. Also set as the DOM id.
   */
  id?: string;
  /** Whether the accordion should be initially expanded. */
  defaultExpanded?: boolean;
  /**
   * The visual variant of the accordion. Has no effect.
   *
   * @deprecated Use `AccordionGroup` or a `LayoutCard` to set accordions apart.
   */
  variant?: "default" | "outline";
}

/*
 * The header button is rendered by the `Heading`, `Text` or `Label` the
 * consumer wrote, through a memoized props context. It reads the disclosure
 * state from a React context instead, so it always gets the current one.
 */
type TriggerProps = Pick<
  ButtonProps,
  "id" | "aria-expanded" | "aria-controls" | "onPress" | "onPressStart"
>;

const TriggerContext = createContext<TriggerProps | null>(null);

interface HeaderButtonProps extends PropsWithChildren {
  /** Text and label headers are smaller than headings, so is their chevron. */
  isCompact?: boolean;
}

/*
 * Declared here and not inside the accordion: a component defined in a render
 * body gets a new identity on every render, so React unmounts and remounts it —
 * and the toggle loses the focus it just received on its own press.
 */
const HeaderButton: FC<HeaderButtonProps> = (props) => {
  const { children, isCompact } = props;
  const buttonProps = useContext(TriggerContext);

  return (
    <Button
      tunnel={null}
      unstyled
      className={styles.headerButton}
      {...buttonProps}
    >
      <span className={styles.headerContent}>{children}</span>
      <IconChevronDown
        className={styles.chevron}
        size={isCompact ? "s" : "m"}
      />
    </Button>
  );
};

/* Text and label headers render the same compact toggle. */
const compactHeader = {
  className: clsx(styles.header, styles.textHeader),
  children: dynamic((props: PropsWithChildren) => (
    <HeaderButton isCompact>{props.children}</HeaderButton>
  )),
};

const propsContext: PropsContext = {
  Content: {
    className: styles.contentInner,
    tunnel: {
      id: "content",
      component: "Accordion",
    },
  },
  Heading: {
    className: styles.header,
    level: 3,
    children: dynamic((props) => <HeaderButton>{props.children}</HeaderButton>),
    Button: { size: "m" },
  },
  Text: {
    ...compactHeader,
    elementType: "div",
  },
  Label: {
    ...compactHeader,
    /*
     * A <label> names the first labelable element below it — here the toggle,
     * whose own text is the label's only content. The name computation walks
     * into the label, meets the button it started from and stops, so the
     * toggle ends up with an empty name. A <span> names nothing and the name
     * comes from the toggle's content again.
     */
    elementType: "span",
  },
};

/**
 * @flr-generate all
 * @flowStatus beta
 */
export const Accordion: FC<AccordionProps> = flowComponent(
  "Accordion",
  (props) => {
    const {
      children,
      className,
      id,
      defaultExpanded = false,
      variant,
      ...rest
    } = props;

    const warnDeprecation = useWarnDeprecation();
    if (variant !== undefined) {
      warnDeprecation(
        "The 'variant' prop of the 'Accordion' component is deprecated and will be removed in a future release. Use 'AccordionGroup' or a 'LayoutCard' to set accordions apart instead.",
      );
    }

    const generatedKey = useId();
    const key = id ?? generatedKey;
    const group = useAccordionGroupContext();
    const register = group?.register;

    /* `onExpandedChange` reports only keys the consumer gave. */
    useEffect(
      () => (id === undefined ? undefined : register?.(id, defaultExpanded)),
      [register, id, defaultExpanded],
    );

    const state = useDisclosureState({
      defaultExpanded,
      ...(group && {
        isExpanded: group.isExpanded(key, defaultExpanded),
        onExpandedChange: (isExpanded) => group.setExpanded(key, isExpanded),
      }),
    });

    const panelRef = useRef<HTMLDivElement>(null);
    const { buttonProps, panelProps } = useDisclosure({}, state, panelRef);
    const triggerProps: TriggerProps = {
      id: buttonProps.id,
      "aria-expanded": state.isExpanded,
      "aria-controls": buttonProps["aria-controls"],
      onPress: buttonProps.onPress,
      onPressStart: buttonProps.onPressStart,
    };

    const rootClassName = clsx(
      styles.accordion,
      state.isExpanded && styles.expanded,
      className,
    );

    return (
      <div {...rest} id={id} className={rootClassName}>
        <TriggerContext value={triggerProps}>
          <PropsContextProvider props={propsContext}>
            {children}
            <div {...panelProps} ref={panelRef} className={styles.content}>
              {/* An accordion inside the content is not part of this group. */}
              <AccordionGroupContext value={null}>
                <UiComponentTunnelExit id="content" component="Accordion" />
              </AccordionGroupContext>
            </div>
          </PropsContextProvider>
        </TriggerContext>
      </div>
    );
  },
  {
    type: "layout",
  },
);

export default Accordion;
