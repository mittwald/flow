"use client";
import {
  Action,
  Button,
  Heading,
  IconLink,
} from "@mittwald/flow-react-components";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";
import styles from "@/lib/mdx/components/MdxFileView/customComponents.module.css";
import { onlyText } from "react-children-utilities";
import slugify from "slugify";

export const AnchorLinkHeading: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setUrl(window.location.origin + window.location.pathname);
  }, []);

  const slug = slugify(onlyText(children), { lower: true, strict: true });

  const copyValue = () => {
    navigator.clipboard.writeText(`${url}#${slug}`);
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
