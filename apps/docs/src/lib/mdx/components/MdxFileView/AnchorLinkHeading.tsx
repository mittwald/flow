"use client";
import {
  Action,
  Button,
  Heading,
  IconLink,
} from "@mittwald/flow-react-components";
import type { FC, PropsWithChildren } from "react";
import styles from "@/lib/mdx/components/MdxFileView/customComponents.module.css";
import { onlyText } from "react-children-utilities";
import copy from "copy-to-clipboard";

export const AnchorLinkHeading: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const url = window.location;

  const slug = onlyText(children)
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();

  const copyValue = () => {
    copy(`${url.origin + url.pathname}#${slug}`);
  };

  return (
    <Heading level={2} className={styles.anchorLinkHeading} id={slug}>
      {children}
      <Action onAction={copyValue} showFeedback>
        <Button
          aria-label="Link kopieren"
          className={styles.anchorButton}
          variant="plain"
          size="s"
        >
          <IconLink />
        </Button>
      </Action>
    </Heading>
  );
};
