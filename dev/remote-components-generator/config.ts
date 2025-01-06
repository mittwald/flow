import type { RemoteComponentGeneratorConfig } from "./types/config";

export const remoteComponentGeneratorConfig: RemoteComponentGeneratorConfig = {
  components: {
    ActionStateContext: {
      ignore: true,
    },
    Form: {
      ignore: true,
    },
    List: {
      ignore: true,
    },
  },
  ignoreProps: ["tunnelId", "ref", "key"],
};
