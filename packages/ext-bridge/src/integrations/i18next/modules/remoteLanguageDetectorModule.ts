import { getConfig } from "@/index-browser";
import { isBrowser } from "@/lib/assertBrowserEnv";
import { type LanguageDetectorAsyncModule } from "i18next";

export const remoteLanguageDetectorModule =
  (): LanguageDetectorAsyncModule => ({
    type: "languageDetector",
    async: true,
    detect: async () => {
      if (isBrowser) {
        const config = await getConfig();
        return config.language;
      }
    },
  });
