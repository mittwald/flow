import type { FC, ReactElement } from "react";
import {
  IconDownload,
  IconExternalLink,
} from "@/components/Icon/components/icons";
import type { LinkProps } from "@/components/Link";
import locales from "../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import styles from "./LinkIcon.module.scss";

export const LinkIcon: FC<LinkProps & { withZeroWidthJoiner?: boolean }> = (
  props,
) => {
  const { unstyled, target, download, withZeroWidthJoiner = false } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "Link");
  let icon: ReactElement | null = null;

  if (download) {
    icon = (
      <IconDownload
        className={styles.linkIcon}
        aria-label={stringFormatter.format("download")}
      />
    );
  } else if (target === "_blank") {
    icon = (
      <IconExternalLink
        className={styles.linkIcon}
        aria-label={stringFormatter.format("external")}
      />
    );
  }

  if (unstyled || !icon) {
    return null;
  }

  if (withZeroWidthJoiner) {
    return (
      <span className={styles.linkIcon}>
        {"\u200D"}
        {icon}
      </span>
    );
  }

  return icon;
};

export default LinkIcon;
