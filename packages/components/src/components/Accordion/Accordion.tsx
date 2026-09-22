import type { ComponentProps, FC, PropsWithChildren, ReactNode } from "react";
import { useCallback, useId, useState } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Activity } from "@/components/Activity";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

export interface AccordionProps extends PropsWithChildren<
  ComponentProps<"div">
> {
  /** Whether the accordion should be initially expanded. */
  defaultExpanded?: boolean;
  /** The visual variant of the accordion. @default "default" */
  variant?: "default" | "outline";
}

interface HeaderButtonProps extends PropsWithChildren {
  contentId: string;
  isExpanded: boolean;
  onToggle: () => void;
}

/*
 * Declared here and not inside the accordion: a component defined in a render
 * body gets a new identity on every render, so React unmounts and remounts it —
 * and the toggle loses the focus it just received on its own press.
 */
const HeaderButton: FC<HeaderButtonProps> = (props) => {
  const { children, contentId, isExpanded, onToggle } = props;

  return (
    <Button
      tunnel={null}
      unstyled
      aria-expanded={isExpanded}
      className={styles.headerButton}
      onPress={onToggle}
      aria-controls={contentId}
    >
      {children}
      <IconChevronDown className={styles.chevron} />
    </Button>
  );
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
      defaultExpanded = false,
      variant = "default",
      ...rest
    } = props;
    const [expanded, setExpanded] = useState(defaultExpanded);

    const rootClassName = clsx(
      styles.accordion,
      expanded && styles.expanded,
      variant === "outline" && styles.outline,
      className,
    );

    const headerId = useId();

    const contentId = useId();

    const toggle = useCallback(() => setExpanded((expanded) => !expanded), []);

    const renderHeaderButton = (children: ReactNode) => (
      <HeaderButton
        contentId={contentId}
        isExpanded={expanded}
        onToggle={toggle}
      >
        {children}
      </HeaderButton>
    );

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
        level: 4,
        size: "xs",
        children: dynamic((props) => renderHeaderButton(props.children)),
        Button: { size: "m" },
      },
      Label: {
        className: styles.header,
        children: dynamic((props) => renderHeaderButton(props.children)),
      },
    };

    return (
      <div {...rest} className={rootClassName}>
        {/*
         * The props context is memoized, and the header button reads `expanded`
         * from it – without the dependency the toggle keeps announcing the state
         * it was first rendered with.
         */}
        {/*
         * The props context is memoized, and the header button takes `expanded`
         * from it – without the dependency the toggle keeps announcing the
         * state it was first rendered with.
         */}
        <PropsContextProvider dependencies={[expanded]} props={propsContext}>
          {children}
          <div
            aria-labelledby={headerId}
            id={contentId}
            role="region"
            hidden={!expanded}
            className={styles.content}
          >
            <Activity isActive={expanded} inactiveDelay={1000}>
              <UiComponentTunnelExit id="content" component="Accordion" />
            </Activity>
          </div>
        </PropsContextProvider>
      </div>
    );
  },
  {
    type: "layout",
  },
);

export default Accordion;
