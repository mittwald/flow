import { hash as objectHash } from "object-code";
import type { AvatarColors } from "@/components/Avatar/Avatar";
import { avatarColors } from "@/components/Avatar/avatarColors";

export const getColorFromInitials = (initials: string): AvatarColors => {
  const code = objectHash(initials);
  const number = Math.abs(code % (avatarColors.length - 1));
  return avatarColors[number] ?? "blue";
};
