import moo from "moo";
import { Data } from "@/kpi-builder/data.types.ts";

export enum TokenType {
  NUMBER = "number",
  KEYWORD = "keyword",
  KEYWORD_PREDICTION = "keyword-prediction",
  KEYWORD_UNKNOWN = "keyword-unknown",
  OPERATOR = "operator",
  FUNCTION = "function-name",
  BRACKET = "bracket",
  COMMA = "comma",
  ERROR = "error",
  WHITESPACE = "WS",
}

export function getLexer(variables: Data[]) {
  return moo.compile({
    [TokenType.WHITESPACE]: /[ \t]+/,
    [TokenType.KEYWORD]: {
      match: variables.map((variable) => `{${variable.name}}`),
      value: (s): string =>
        variables.find((variable) => s === `{${variable.name}}`)?.displayName ??
        s,
    },
    [TokenType.KEYWORD_UNKNOWN]: {
      match: /\{[a-zA-Z]*}/,
      value: (s): string => s.slice(1, -1),
    },
    [TokenType.KEYWORD_PREDICTION]: {
      match: /\{[a-zA-Z]*/,
      value: (s): string => s.slice(1),
    },
    [TokenType.NUMBER]: /0|[1-9][0-9]*/, // TODO: Negative and float numbers
    [TokenType.FUNCTION]: ["round", "sin", "tan"],
    [TokenType.COMMA]: [","],
    [TokenType.BRACKET]: ["(", ")"],
    [TokenType.OPERATOR]: ["+", "-", "*", "/"],
    [TokenType.ERROR]: moo.error,
  });
}
