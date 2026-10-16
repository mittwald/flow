import type { FC } from "react";
import clsx from "clsx";
import { VisuallyHidden } from "react-aria-components";
import {
  IconCheckboxChecked,
  IconCheckboxEmpty,
} from "@/components/Icon/components/icons";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";
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

  const isSkeleton = useSkeletonMode();

  const checkedIcon = (
    <IconCheckboxChecked
      className={clsx(styles.taskListIcon, styles.checked)}
    />
  );
  const emptyIcon = <IconCheckboxEmpty className={styles.taskListIcon} />;
  const icon = checked ? checkedIcon : emptyIcon;

  const checkbox = (
    <span className={styles.taskListCheckbox}>
      <VisuallyHidden elementType="span">
        <input type="checkbox" checked={checked} disabled readOnly />
      </VisuallyHidden>
      {icon}
    </span>
  );

  /* Like `Checkbox`: a box around the icon is the surface. */
  const skeletonCheckbox = (
    <span className={styles.taskListCheckbox} inert>
      <span className={styles.taskListSkeletonIcon}>
        <SkeletonModeReset>{icon}</SkeletonModeReset>
      </span>
    </span>
  );

  return isSkeleton ? skeletonCheckbox : checkbox;
};
