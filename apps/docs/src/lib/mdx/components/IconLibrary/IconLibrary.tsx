import type { FC } from "react";
import {
  AccentBox,
  ColumnLayout,
  iconCategories,
  type IconCategory,
  Label,
  LabeledValue,
} from "@mittwald/flow-react-components";
import * as FlowComponents from "@mittwald/flow-react-components";

type IconComponent = FC<Record<string, never>>;

const iconComponents = FlowComponents as unknown as Record<
  string,
  IconComponent | undefined
>;

interface Props {
  category: IconCategory;
}

export const IconLibrary: FC<Props> = (props) => {
  const { category } = props;

  return (
    <AccentBox>
      <ColumnLayout l={[1, 1, 1, 1, 1]} m={[1, 1, 1]} s={[1, 1]}>
        {iconCategories[category].map((name) => {
          const Icon = iconComponents[`Icon${name}`];

          if (!Icon) {
            return null;
          }

          return (
            <LabeledValue key={name}>
              <Label>{name}</Label>
              <Icon />
            </LabeledValue>
          );
        })}
      </ColumnLayout>
    </AccentBox>
  );
};

export default IconLibrary;
