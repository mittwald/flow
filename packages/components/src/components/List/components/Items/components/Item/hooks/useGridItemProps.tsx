import type { PropsWithChildren } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { useList } from "@/components/List";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { AccordionButton } from "@/components/List/components/Items/components/Item/components/AccordionButton";

interface P extends PropsWithChildren {
  data: never;
}

export const useGridItemProps = (props: P) => {
  const { data, children: childrenFromProps } = props;
  const list = useList();
  const itemView = list.itemView;
  const onAction = list.onAction;

  const [isExpanded, setIsExpanded] = useState(
    itemView?.defaultExpanded?.(data) ?? false,
  );
  const contentElementId = useId();
  const itemRef = useRef<HTMLDivElement>(null);

  const accordion = list.accordion;
  const children = childrenFromProps ?? itemView?.render(data);

  useEffect(() => {
    if (accordion) {
      itemRef.current?.setAttribute("aria-expanded", String(isExpanded));
      itemRef.current?.setAttribute("aria-controls", contentElementId);
    }
  }, [isExpanded, contentElementId, itemRef.current, accordion]);

  if (!accordion) {
    return {
      gridItemProps: {
        onAction: onAction
          ? () => {
              onAction?.(data);
            }
          : undefined,
      },
      children,
    };
  }

  const toggleAccordion = () => {
    setIsExpanded((current) => !current);
    onAction?.(data);
  };

  const propsContext: PropsContext = {
    Content: {
      id: dynamic((p) => (p.slot === "bottom" ? contentElementId : undefined)),
      wrapWith: dynamic((p) =>
        p.slot === "bottom" ? (
          <AccordionButton
            contentElementId={contentElementId}
            toggle={toggleAccordion}
            isExpanded={isExpanded}
          />
        ) : undefined,
      ),
    },
  };

  return {
    gridItemProps: {
      ref: itemRef,
      onAction: toggleAccordion,
    },
    children: (
      <PropsContextProvider
        props={propsContext}
        dependencies={[contentElementId, isExpanded]}
      >
        {children}
      </PropsContextProvider>
    ),
  };
};
