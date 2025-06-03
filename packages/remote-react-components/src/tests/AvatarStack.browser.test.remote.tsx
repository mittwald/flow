import { Avatar, AvatarStack, Initials } from "@/auto-generated";
import React from "react";

export const standard = () => (
  <AvatarStack data-testid="avatarStack">
    <Avatar>
      <Initials>Max Mustermann</Initials>
    </Avatar>
    <Avatar>
      <Initials>John Doe</Initials>
    </Avatar>
  </AvatarStack>
);
