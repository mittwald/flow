import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Button } from "@/components/Button";
import { IconContextMenu } from "@/components/Icon/components/icons";
import { ContextMenuTrigger } from "@/components/ContextMenu";
import locales from "../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

interface Props extends PropsWithChildren {
  className?: string;
}

export const OptionsButton: FC<Props> = (props) => {
  const { className, children } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <ContextMenuTrigger>
      <Button
        variant="plain"
        className={className}
        aria-label={stringFormatter.format("options")}
      >
        <IconContextMenu />
      </Button>
      {children}
    </ContextMenuTrigger>
  );
};

export default OptionsButton;
