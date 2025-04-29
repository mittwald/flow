import { resolveFileContents } from "@/utils/file";
import { deepMapValues } from "@/utils/helper";

type EventObjectResolverMap = Record<
  "File" | "FileList",
  (event: unknown) => unknown
>;

const eventObjectResolvers: EventObjectResolverMap = {
  FileList: (event) =>
    Promise.all([...(event as FileList)].map(eventObjectResolvers.File)),
  File: resolveFileContents,
};

export const eventValueTransformer = (event: unknown) => {
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
