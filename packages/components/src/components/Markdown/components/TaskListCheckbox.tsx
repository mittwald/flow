import type { FC } from "react";
import clsx from "clsx";
import { VisuallyHidden } from "react-aria-components";
import {
  IconCheckboxChecked,
  IconCheckboxEmpty,
} from "@/components/Icon/components/icons";
import styles from "../Markdown.module.scss";

interface Props {
  checked?: boolean;
}

/**
 * The checkbox of a GFM task list item. The native input stays for assistive
 * technology, the icon is what `Checkbox` shows.
 */
export const TaskListCheckbox: FC<Props> = (props) => {
  const { checked = false } = props;

  const checkedIcon = (
    <IconCheckboxChecked
      className={clsx(styles.taskListIcon, styles.checked)}
    />
  );
  const emptyIcon = <IconCheckboxEmpty className={styles.taskListIcon} />;

  return (
    <span className={styles.taskListCheckbox}>
      <VisuallyHidden elementType="span">
        <input type="checkbox" checked={checked} disabled readOnly />
      </VisuallyHidden>
      {checked ? checkedIcon : emptyIcon}
    </span>
  );
};
