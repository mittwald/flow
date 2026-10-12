import * as Aria from "react-aria-components";
import { useContext, useRef, type FC } from "react";
import type { Key, Node } from "@react-types/shared";
import type { TreeState } from "react-stately";
import { MenuItemContent } from "@/components/MenuItem/components/MenuItemContent/MenuItemContent";
import menuItemStyles from "@/components/MenuItem/MenuItem.module.scss";
import { Text } from "@/components/Text";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../locales/*.locale.json";
import styles from "../../ContextMenu.module.scss";

const selectAllSectionId = "flow--context-menu--select-all";

/**
 * Keys that share the menu's selection: enabled items at the top level and in
 * sections without a selection mode of their own.
 */
const getSelectableKeys = (state: TreeState<unknown>): Key[] => {
  const keys: Key[] = [];

  const collect = (nodes: Iterable<Node<unknown>>) => {
    for (const node of nodes) {
      if (node.type === "item") {
        if (!state.selectionManager.isDisabled(node.key)) {
          keys.push(node.key);
        }
      } else if (
        node.type === "section" &&
        node.key !== selectAllSectionId &&
        node.props?.selectionMode === undefined
      ) {
        collect(state.collection.getChildren?.(node.key) ?? node.childNodes);
      }
    }
  };

  collect(state.collection);
  return keys;
};

interface SelectAll {
  isEverySelected: boolean;
  toggle: () => void;
}

/**
 * Rendered by the visible menu item. The collection renders the item's element
 * a second time outside the menu, where `MenuStateContext` is missing.
 */
const SelectAllMenuItemContent: FC<
  Aria.MenuItemRenderProps & { selectAll: { current?: SelectAll } }
> = (props) => {
  const { selectAll, ...renderProps } = props;
  const state = useContext(Aria.MenuStateContext);
  const formatter = useLocalizedStringFormatter(locales, "ContextMenu");

  const selectionManager = state?.selectionManager;
  const keys = state ? getSelectableKeys(state) : [];
  const selectedCount = keys.filter((key) =>
    selectionManager?.isSelected(key),
  ).length;
  const isEverySelected = keys.length > 0 && selectedCount === keys.length;
  const isIndeterminate = selectedCount > 0 && !isEverySelected;

  selectAll.current = {
    isEverySelected,
    toggle: () => {
      if (!selectionManager) {
        return;
      }
      const keySet = new Set(keys);
      const otherSelectedKeys = [...selectionManager.selectedKeys].filter(
        (key) => !keySet.has(key),
      );
      selectionManager.setSelectedKeys(
        isEverySelected ? otherSelectedKeys : [...otherSelectedKeys, ...keys],
      );
    },
  };

  return (
    <MenuItemContent
      {...renderProps}
      selectionMode="multiple"
      isSelected={isEverySelected}
      isIndeterminate={isIndeterminate}
    >
      <Text>
        {formatter.format(isEverySelected ? "deselectAll" : "selectAll")}
      </Text>
    </MenuItemContent>
  );
};

const SelectAllMenuItem: FC = () => {
  const selectAll = useRef<SelectAll>(undefined);
  const formatter = useLocalizedStringFormatter(locales, "ContextMenu");

  return (
    <Aria.MenuItem
      id={`${selectAllSectionId}--item`}
      textValue={formatter.format("selectAll")}
      shouldCloseOnSelect={false}
      onAction={() => selectAll.current?.toggle()}
      className={menuItemStyles.menuItem}
    >
      {(renderProps) => (
        <SelectAllMenuItemContent {...renderProps} selectAll={selectAll} />
      )}
    </Aria.MenuItem>
  );
};

/**
 * The entry lives in a section without selection, so pressing it runs its
 * action only and sets the whole selection in one change.
 */
export const ContextMenuSelectAll: FC = () => (
  <Aria.MenuSection
    id={selectAllSectionId}
    selectionMode="none"
    className={styles.selectAll}
  >
    <SelectAllMenuItem />
  </Aria.MenuSection>
);

export default ContextMenuSelectAll;
