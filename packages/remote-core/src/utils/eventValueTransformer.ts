import { resolveFileContents } from "@/utils/file";
import { deepMapValues } from "@/utils/helper";

const eventObjectResolvers = {
  FileList: (event: unknown) =>
    Promise.all([...(event as FileList)].map(eventObjectResolvers.File)),
  File: resolveFileContents,
} as const;

type EventObjectResolverMap = typeof eventObjectResolvers;

export const eventValueTransformer = (eventName: string, event: unknown) => {
  const replaceMaybeObjectTypeWithPromise = (value: unknown) => {
    const constructorName = value?.constructor
      .name as keyof EventObjectResolverMap;

    const eventObjectResolverFunction = eventObjectResolvers[constructorName];
    if (constructorName && eventObjectResolverFunction) {
      return eventObjectResolverFunction(value);
    }

    return value;
  };

  return deepMapValues(event, replaceMaybeObjectTypeWithPromise);
};
