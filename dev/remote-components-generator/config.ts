import type { RemoteComponentGeneratorConfig } from "./types/config";

export const remoteComponentGeneratorConfig: RemoteComponentGeneratorConfig = {
  components: {
    ActionStateContext: {
      ignore: true,
    },
  },
  ignoreProps: ["tunnelId", "ref", "key"],
};
