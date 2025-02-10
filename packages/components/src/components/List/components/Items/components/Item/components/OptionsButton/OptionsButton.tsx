import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Button } from "@/components/Button";
import { IconContextMenu } from "@/components/Icon/components/icons";
import { ContextMenuTrigger } from "@/components/ContextMenu";
import locales from "../../../../../../locales/*.locale.json";
import useLocalizedStringFormatter from "@/lib/i18n/useLocalizedStringFormatter";
import type { PropsWithClassName } from "@/lib/types/props";

interface Props extends PropsWithChildren, PropsWithClassName {}

export const OptionsButton: FC<Props> = (props) => {
  const { className, children } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <ContextMenuTrigger>
      <Button
        variant="plain"
        color="secondary"
        className={className}
        aria-label={stringFormatter.format("list.options")}
        tunnelId={null}
      >
        <IconContextMenu />
      </Button>
      {children}
    </ContextMenuTrigger>
  );
};

export default OptionsButton;
