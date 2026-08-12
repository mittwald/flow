import { Fragment, type FC } from "react";
import type { FormattedType } from "@/lib/PropertiesTables/lib/unionType";
import styles from "../PropertiesTables.module.scss";

export const TypeValue: FC<FormattedType> = ({ members, defaultMember }) => (
  <>
    {members.map((member, index) => (
      <Fragment key={member}>
        {index > 0 && " | "}
        {member}
        {member === defaultMember && (
          <span className={styles.defaultMarker}> (default)</span>
        )}
      </Fragment>
    ))}
  </>
);
