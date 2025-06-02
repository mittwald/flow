import { ActionGroup, Button } from "@/auto-generated";
import React from "react";

export const standard = () => (
  <ActionGroup data-testid="actionGroup">
    <Button color="accent">Create customer</Button>
    <Button variant="soft" color="secondary">
      Abort
    </Button>
  </ActionGroup>
);
