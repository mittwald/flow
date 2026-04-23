import type { FC } from "react";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import { useList } from "@/components/List";
import { IconView } from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import TextView from "@/views/TextView";
import { ViewModeMenuItem } from "@/components/List/components/Header/components/ViewModeContextMenu/ViewModeMenuItem";
import { useAvailableViewModes } from "@/components/List/components/Header/lib";
import styles from "@/components/List/components/Header/Header.module.css";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";

interface Props {
  isDisabled?: boolean;
}

export const ViewModeContextMenu: FC<Props> = (props) => {
  const { isDisabled } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "List");
  const list = useList();
  const selectedViewMode = list.viewMode.value;

  const availableViewModes = useAvailableViewModes();

  if (availableViewModes.length <= 1) {
    return null;
  }

  return (
    <ContextMenuTriggerView>
      <ButtonView
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("settings")}
        className={styles.hideOnMobile}
        isDisabled={isDisabled}
      >
        <TextView>
          {stringFormatter.format(`settings.viewMode.${selectedViewMode}`)}
        </TextView>
        <IconView />
      </ButtonView>
      <ContextMenuView selectionMode="single" selectedKeys={[selectedViewMode]}>
        {availableViewModes.map((viewMode) => (
          <ViewModeMenuItem viewMode={viewMode} key={viewMode} />
        ))}
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
