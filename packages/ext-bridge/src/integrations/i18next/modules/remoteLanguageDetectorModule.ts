import { getConfig } from "@/index-browser";
import { type LanguageDetectorAsyncModule } from "i18next";

export const remoteLanguageDetectorModule: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: async () => {
    const config = await getConfig();
    return config.language;
  },
};
