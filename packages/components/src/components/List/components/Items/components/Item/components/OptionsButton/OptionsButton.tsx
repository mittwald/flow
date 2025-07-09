import type { FC, PropsWithChildren } from "react";
import locales from "../../../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { PropsWithClassName } from "@/lib/types/props";
import { IconContextMenu } from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";

interface Props extends PropsWithChildren, PropsWithClassName {}

export const OptionsButton: FC<Props> = (props) => {
  const { className, children } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <ContextMenuTriggerView>
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
    </ContextMenuTriggerView>
  );
};

export default OptionsButton;
