import { describe, expect, test } from "vitest";
import {
  formatValidationResult,
  generateValidationTranslation,
} from "./generateValidationTranslation";
import {
  RuleType,
  type RuleValidationResult,
} from "@/integrations/@mittwald/password-tools-js";

type Rule = Partial<RuleValidationResult>;

const key = (rule: Rule, shortVersion?: boolean) =>
  generateValidationTranslation(rule, shortVersion)[0];

describe("key composition", () => {
  test("a rule without a type falls back to the general namespace", () => {
    expect(key({ isValid: false })).toBe("validation.general");
  });

  test("a rule type alone names the section", () => {
    expect(key({ ruleType: RuleType.hibp })).toBe("validation.hibp");
  });

  test("an identifier without a boundary is appended to the rule type", () => {
    expect(key({ ruleType: RuleType.sequence, identifier: "keyboard" })).toBe(
      "validation.sequence.keyboard",
    );
  });

  test("an identifier on a general rule builds the state keys", () => {
    expect(key({ identifier: "securePassword" })).toBe(
      "validation.general.securePassword",
    );
  });
});

describe("boundaries", () => {
  test("min alone selects the min key", () => {
    expect(key({ ruleType: RuleType.length, min: 8 })).toBe(
      "validation.length.min",
    );
  });

  test("max alone selects the max key", () => {
    expect(key({ ruleType: RuleType.length, max: 64 })).toBe(
      "validation.length.max",
    );
  });

  test("with both boundaries and no failingBoundary, min wins", () => {
    expect(key({ ruleType: RuleType.length, min: 8, max: 64 })).toBe(
      "validation.length.min",
    );
  });

  test("failingBoundary decides which boundary the message is about", () => {
    expect(
      key({
        ruleType: RuleType.length,
        min: 8,
        max: 64,
        failingBoundary: "max",
      }),
    ).toBe("validation.length.max");
  });

  test("the identifier is nested between rule type and boundary", () => {
    expect(
      key({ ruleType: RuleType.charPool, identifier: "numbers", min: 1 }),
    ).toBe("validation.charPool.numbers.min");
  });
});

describe("short version", () => {
  test("appends .short", () => {
    expect(key({ ruleType: RuleType.length, min: 8 }, true)).toBe(
      "validation.length.min.short",
    );
  });

  test("an explicit translationKey is used verbatim, short version included", () => {
    const rule: Rule = { translationKey: "atLeastOneCapitalLetter" };
    expect(key(rule)).toBe("validation.atLeastOneCapitalLetter");
    expect(key(rule, true)).toBe("validation.atLeastOneCapitalLetter");
  });
});

describe("translation values", () => {
  test("char rules hand the message the characters as one string", () => {
    const [, values] = generateValidationTranslation({
      ruleType: RuleType.char,
      chars: [
        { char: "!", occurrences: 1 },
        { char: "?", occurrences: 0 },
      ],
      min: 1,
    });

    expect(values).toMatchObject({ chars: "!?", min: 1 });
  });

  test("a char rule without chars passes the rule through unchanged", () => {
    const rule: Rule = { ruleType: RuleType.char, min: 1 };
    expect(generateValidationTranslation(rule)[1]).toBe(rule);
  });

  test("any other rule is passed through as the message values", () => {
    const rule: Rule = { ruleType: RuleType.length, min: 8 };
    expect(generateValidationTranslation(rule)[1]).toBe(rule);
  });
});

describe("formatValidationResult", () => {
  const formatter = {
    format: (key: string, variables?: Record<string, unknown>) => {
      if (key.startsWith("validation.general.fallback")) {
        return `${key}:${String(variables?.isValid)}`;
      }
      if (key === "validation.hibp") {
        return "translated";
      }
      throw new Error(`Could not find intl message ${key}`);
    },
  };

  test("a translated rule keeps its message", () => {
    expect(formatValidationResult(formatter, { ruleType: RuleType.hibp })).toBe(
      "translated",
    );
  });

  test("a rejecting rule without a translation gets the generic message", () => {
    expect(
      formatValidationResult(formatter, {
        ruleType: RuleType.charPool,
        identifier: "lowercase",
        min: 1,
        isValid: false,
      }),
    ).toBe("validation.general.fallback:false");
  });

  test("the short version falls back to the short generic message", () => {
    expect(
      formatValidationResult(
        formatter,
        { ruleType: RuleType.regex, identifier: "custom", isValid: true },
        true,
      ),
    ).toBe("validation.general.fallback.short:true");
  });
});
