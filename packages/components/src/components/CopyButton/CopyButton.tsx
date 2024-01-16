import React, { FC, ReactNode } from "react";
import { extractStringFromReactNode } from "@/lib/extractStringFromReactNode/extractStringFromReactNode";
import copy from "copy-to-clipboard";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { faCopy } from "@fortawesome/free-regular-svg-icons/faCopy";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import styles from "./CopyButton.module.css";
import clsx from "clsx";

export interface CopyButtonProps {
  value: ReactNode;
  className?: string;
}

export const CopyButton: FC<CopyButtonProps> = (props) => {
  const { value, className } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const rootClassName = clsx(className, styles.root);

  const ariaLabel = stringFormatter.format("copyButton.copy");

  const copyValue = () => {
    copy(extractStringFromReactNode(value));
  };

  return (
    <Button
      className={rootClassName}
      onPress={copyValue}
      aria-label={ariaLabel}
      variant="plain"
    >
      <Icon faIcon={faCopy} />
    </Button>
  );
};

export default CopyButton;
