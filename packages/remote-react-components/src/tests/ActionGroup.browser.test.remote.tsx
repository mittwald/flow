import { ActionGroup, Button } from "@/auto-generated";
import React from "react";

export const standard = () => (
  <ActionGroup data-testid="actionGroup">
    <Button color="accent" data-testid="primaryButton">
      Create customer
    </Button>
    <Button variant="soft" color="secondary" data-testid="abortButton">
      Abort
    </Button>
  </ActionGroup>
);
