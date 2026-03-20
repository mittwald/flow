import { langs, type LanguageName } from "@uiw/codemirror-extensions-langs";
import {
  type LanguageSupport,
  type StreamLanguage,
} from "@codemirror/language";
import type { linter } from "@codemirror/lint";
import type { Extension } from "@uiw/react-codemirror";
import DotEnvLanguage from "@/components/CodeEditor/languages/dotEnv";

export type CodeEditorLanguage = LanguageName | "dotEnv";

export type LanguageFactory = Record<
  CodeEditorLanguage,
  (() =>
    | StreamLanguage<unknown>
    | LanguageSupport
    | Extension
    | ReturnType<typeof linter>)[]
>;

export type LanguageContainer = [
  () => Extension,
  () => LanguageSupport,
  () => ReturnType<typeof linter>,
];

const supportedCodeEditorLanguages: LanguageFactory = {} as never;
Object.keys(langs).forEach((key) => {
  const languageKey = key as CodeEditorLanguage;
  supportedCodeEditorLanguages[languageKey] = [
    langs[languageKey as LanguageName],
  ];
});

supportedCodeEditorLanguages.dotEnv = DotEnvLanguage;

export default supportedCodeEditorLanguages;
