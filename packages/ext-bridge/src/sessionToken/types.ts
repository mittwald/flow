import type {
  extensionContext,
  extensionScopes,
  sessionTokenPayload,
} from "@/sessionToken/schemas";
import type { z } from "zod";

export type ExtensionScopes = z.infer<typeof extensionScopes>;
export type ExtensionContext = z.infer<typeof extensionContext>;
export type SessionTokenPayload = z.infer<typeof sessionTokenPayload>;
