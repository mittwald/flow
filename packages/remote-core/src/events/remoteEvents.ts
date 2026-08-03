import { z } from "zod";

export const componentRenderedEventSchema = z.object({
  event: z.literal("ComponentRendered"),
  data: z.object({
    component: z.string(),
    isInternalComposition: z.boolean(),
  }),
});

export const reportedEventSchema = z.discriminatedUnion("event", [
  componentRenderedEventSchema,
]);

export type ComponentRenderedEvent = z.infer<
  typeof componentRenderedEventSchema
>;

export type ReportedEvent = z.infer<typeof reportedEventSchema>;
export type ReportedEventName = ReportedEvent["event"];

export const parseReportedEvent = (
  event: unknown,
): ReportedEvent | undefined => {
  const result = reportedEventSchema.safeParse(event);
  return result.success ? result.data : undefined;
};
