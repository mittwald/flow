"use client";
import {
  Action,
  Button,
  Heading,
  IconLink,
} from "@mittwald/flow-react-components";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";
import styles from "@/lib/mdx/components/MdxFileView/customComponents.module.css";
import slugify from "slugify";
import clsx from "clsx";

interface Props extends PropsWithChildren {
  level: number;
  slugText: string;
}

export const AnchorLinkHeading: FC<Props> = (props) => {
  const { children, level, slugText } = props;

  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setUrl(window.location.origin + window.location.pathname);
  }, []);

  const slug = slugify(slugText, { lower: true, strict: true });

  const copyValue = () => {
    navigator.clipboard.writeText(`${url}#${slug}`);
  };

  return (
    <Heading
      level={level}
      className={clsx(
        styles.anchorLinkHeading,
        level === 2 && styles.sectionHeading,
        level === 3 && styles.subSectionHeading,
      )}
      id={slug}
    >
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
