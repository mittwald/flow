import type { FC } from "react";
import React from "react";
import { IconFilter } from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import { useList } from "@/components/List";
import HeadingView from "@/views/HeadingView";
import { FilterMenuItem } from "@/components/List/components/Header/components/Filters/FilterMenuItem";
import styles from "@/components/List/components/Header/Header.module.css";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../../../locales/*.locale.json";
import ContextMenuSectionView from "@/views/ContextMenuSectionView";
import SeparatorView from "@/views/SeparatorView";
import ContextMenuTriggerView from "@/views/ContextMenuTriggerView";
import ContextMenuView from "@/views/ContextMenuView";

export const CombinedFilterMenu: FC = () => {
  const list = useList();

  const filters = list.filters;

  const stringFormatter = useLocalizedStringFormatter(locales);

  if (filters.length === 0) {
    return null;
  }

  return (
    <ContextMenuTriggerView>
      <ButtonView
        className={styles.mobile}
        variant="outline"
        color="secondary"
        aria-label={stringFormatter.format("list.filters")}
      >
        <IconFilter />
      </ButtonView>
      <ContextMenuView>
        {filters.map((f, i) => {
          const activeFilterKeys = f.values
            .filter((v) => v.isActive)
            .map((v) => v.id);

          return (
            <React.Fragment key={f.property}>
              <ContextMenuSectionView
                selectionMode={f.mode === "one" ? "single" : "multiple"}
                selectedKeys={activeFilterKeys}
              >
                <HeadingView>{f.name ?? f.property}</HeadingView>
                {f.values.map((v) => (
                  <FilterMenuItem key={v.id} filterValue={v} />
                ))}
              </ContextMenuSectionView>
              {i + 1 < filters.length && <SeparatorView />}
            </React.Fragment>
          );
        })}
      </ContextMenuView>
    </ContextMenuTriggerView>
  );
};
