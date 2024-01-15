import React, { FC, ReactNode } from "react";
import { extractStringFromReactNode } from "@/lib/extractStringFromReactNode/extractStringFromReactNode";
import copy from "copy-to-clipboard";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { faCopy } from "@fortawesome/free-regular-svg-icons/faCopy";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export interface CopyButtonProps {
  value: ReactNode;
}

export const CopyButton: FC<CopyButtonProps> = (props) => {
  const { value } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const ariaLabel = stringFormatter.format("copyButton.copy");

  return (
    <Button
      onPress={() => copy(extractStringFromReactNode(value))}
      aria-label={ariaLabel}
    >
      <Icon faIcon={faCopy} />
    </Button>
  );
};

export default CopyButton;
