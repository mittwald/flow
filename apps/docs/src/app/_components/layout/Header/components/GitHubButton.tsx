"use client";

import { Button, Icon } from "@mittwald/flow-react-components";
import { IconBrandGithub } from "@tabler/icons-react";

export const GitHubButton = () => {
  return (
    <a href="https://github.com/mittwald/flow" target="_blank">
      <Button
        aria-label="GitHub"
        variant="plain"
        color="secondary"
        slot="primary"
        style={{ flexGrow: 0, width: "auto" }}
      >
        <Icon>
          <IconBrandGithub />
        </Icon>
      </Button>
    </a>
  );
};
