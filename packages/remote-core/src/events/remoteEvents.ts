import { z } from "zod";

export const componentRenderedEventSchema = z.object({
  event: z.literal("ComponentRendered"),
  data: z.object({
    /** Display name of the Flow component the extension rendered. */
    component: z.string(),
  }),
});

export const reportedEventSchema = z.discriminatedUnion("event", [
  componentRenderedEventSchema,
]);

export type ComponentRenderedEvent = z.infer<
  typeof componentRenderedEventSchema
>;

export type ReportedEvent = z.infer<typeof reportedEventSchema>;

export const parseReportedEvent = (
  event: unknown,
): ReportedEvent | undefined => {
  const result = reportedEventSchema.safeParse(event);
  return result.success ? result.data : undefined;
};
