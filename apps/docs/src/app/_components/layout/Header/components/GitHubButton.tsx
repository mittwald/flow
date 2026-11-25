"use client";

import { Button, Icon } from "@mittwald/flow-react-components";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FC } from "react";

interface Props {
  color?: "secondary" | "dark";
}

export const GitHubButton: FC<Props> = ({ color = "secondary" }) => {
  return (
    <a href="https://github.com/mittwald/flow" target="_blank">
      <Button
        aria-label="GitHub"
        variant="plain"
        color={color}
        slot="primary"
        style={{ flexGrow: 0, width: "auto" }}
      >
        <Icon>
          <FontAwesomeIcon icon={faGithub} />
        </Icon>
      </Button>
    </a>
  );
};
