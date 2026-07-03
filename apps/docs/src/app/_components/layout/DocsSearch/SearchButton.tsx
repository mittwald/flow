"use client";
import { type FC } from "react";
import {
  Button,
  Flex,
  IconSearch,
  Kbd,
  Text,
} from "@mittwald/flow-react-components";
import type { OverlayController } from "@mittwald/flow-react-components";
import styles from "./DocsSearch.module.scss";

interface Props {
  controller: OverlayController;
  iconOnly?: boolean;
}

export const SearchButton: FC<Props> = ({ controller, iconOnly }) => {
  if (iconOnly) {
    return (
      <Button
        variant="outline"
        onPress={() => controller.open()}
        aria-label={"Dokumentation durchsuchen"}
      >
        <IconSearch />
      </Button>
    );
  } else {
    return (
      <Button
        variant="plain"
        className={styles.trigger}
        onPress={() => controller.open()}
      >
        <Flex gap="s">
          <IconSearch />
          <Text>Suche</Text>
        </Flex>
        <Kbd keys={["mod", "k"]} />
      </Button>
    );
  }
};

export default SearchButton;
