import type { ButtonProps } from "@/components/Button";

export const getActionGroupSlot = (props: ButtonProps): string => {
  const { slot: slotFromProps, ...buttonProps } = props;

  const guessedSlot =
    buttonProps.color === "primary" ||
    buttonProps.color === "danger" ||
    buttonProps.color === "accent"
      ? "primary"
      : "abort";

  return slotFromProps ?? guessedSlot;
};
