import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Button } from "@/components/Button";
import {
  IconChevronDown,
  IconChevronUp,
} from "@/components/Icon/components/icons";
import locales from "../../../../../locales/*.locale.json";
import useLocalizedStringFormatter from "@/lib/i18n/useLocalizedStringFormatter";

interface Props extends PropsWithChildren {
  isExpanded: boolean;
  toggle: () => void;
  contentElementId: string;
}

export const AccordionButton: FC<Props> = (props) => {
  const { isExpanded, toggle, children, contentElementId } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <>
      <Button
        variant="plain"
        color="secondary"
        onPress={toggle}
        aria-label={stringFormatter.format(
          "list.toggleExpandButton." + (isExpanded ? "collapse" : "expand"),
        )}
        aria-controls={contentElementId}
        aria-expanded={isExpanded}
      >
        {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
      </Button>
      {isExpanded && children}
    </>
  );
};
