import type { FC } from "react";
import React from "react";
import { Button } from "@/components/Button";
import styles from "@/components/FileCard/FileCard.module.scss";
import { IconClose } from "@/components/Icon/components/icons";
import locales from "../../locales/*.locale.json";
import useLocalizedStringFormatter from "@/lib/i18n/useLocalizedStringFormatter";

interface Props {
  onDelete: () => void;
}

export const DeleteButton: FC<Props> = (props) => {
  const { onDelete } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Button
      className={styles.deleteButton}
      aria-label={stringFormatter.format(`fileCard.delete`)}
      size="s"
      variant="plain"
      color="secondary"
      onPress={onDelete}
    >
      <IconClose />
    </Button>
  );
};

export default DeleteButton;
