import type { FC, PropsWithChildren } from "react";
import {
  IconChevronDown,
  IconChevronUp,
} from "@/components/Icon/components/icons";
import locales from "../../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import ButtonView from "@/views/ButtonView";
import styles from "../../../../ListItemView/ListItemView.module.scss";

interface Props extends PropsWithChildren {
  isExpanded: boolean;
  toggle: () => void;
  contentElementId: string;
}

export const AccordionButton: FC<Props> = (props) => {
  const { isExpanded, toggle, children, contentElementId } = props;
  const stringFormatter = useLocalizedStringFormatter(locales, "List");

  return (
    <>
      <ButtonView
        className={styles.action}
        tunnel={{
          id: "button",
          component: "Accordion",
        }}
        variant="plain"
        color="secondary"
        onPress={toggle}
        aria-label={stringFormatter.format(
          "toggleExpandButton." + (isExpanded ? "collapse" : "expand"),
        )}
        aria-controls={contentElementId}
        aria-expanded={isExpanded}
      >
        {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
      </ButtonView>
      {isExpanded && children}
    </>
  );
};
