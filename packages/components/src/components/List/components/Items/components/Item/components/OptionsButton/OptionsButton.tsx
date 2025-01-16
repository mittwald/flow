import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Button } from "~/components/Button";
import { ContextMenuTrigger } from "~/components/ContextMenu";
import locales from "../../../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { PropsWithClassName } from "~/lib/types/props";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";
import { IconContextMenu } from "~/components/Icon/components/icons";

interface Props extends PropsWithChildren, PropsWithClassName {}

export const OptionsButton: FC<Props> = (props) => {
  const { className, children } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  const { ButtonView } = useViewComponents(["Button", Button]);

  return (
    <ContextMenuTrigger>
      <ButtonView
        variant="plain"
        color="secondary"
        className={className}
        aria-label={stringFormatter.format("list.options")}
        tunnelId={null}
      >
        <IconContextMenu />
      </ButtonView>
      {children}
    </ContextMenuTrigger>
  );
};

export default OptionsButton;
