import type { FC } from "react";
import React from "react";
import {
  IconDownload,
  IconExternalLink,
} from "@/components/Icon/components/icons";
import type { LinkProps } from "@/components/Link";
import locales from "../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";

export const LinkIcon: FC<LinkProps> = (props) => {
  const { unstyled, target, download } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "Link");

  if (unstyled) {
    return null;
  }

  if (download) {
    return <IconDownload aria-label={stringFormatter.format("download")} />;
  }

  if (target === "_blank") {
    return <IconExternalLink aria-label={stringFormatter.format("external")} />;
  }

  return null;
};

export default LinkIcon;
