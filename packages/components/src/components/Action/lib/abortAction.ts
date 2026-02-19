import { AbortActionError } from "@/components/Action/AbortActionError";

export const abortAction: (message?: string) => never = (message) => {
  throw new AbortActionError(message);
};
