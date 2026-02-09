import cronstrue from "cronstrue";
import "cronstrue/locales/de";
import parser from "cron-parser";

export const cronstrueToString = (cronSyntax: string) => {
  return cronstrue.toString(cronSyntax, {
    locale: "de",
    verbose: true,
  });
};

export const parse = (cron: string) => {
  return parser.parse(cron);
};
