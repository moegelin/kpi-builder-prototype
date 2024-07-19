import { Token } from "moo";
import { TokenType } from "@/kpi-builder/lexer.ts";

type TokenError = {
  token: Token;
  error: string;
};

type UnclosedToken = {
  text: string;
  type: "function" | "group";
  token: Token;
};

export function validateTokens(tokens: Token[]) {
  const errors: TokenError[] = [];
  const unclosedTokens: UnclosedToken[] = [];
  const nonWhitespaceTokens = tokens.filter(
    (token) => token.type !== TokenType.WHITESPACE,
  );

  let previousToken: Token | null = null;
  let functionLevel = 0;

  nonWhitespaceTokens.forEach((token, i) => {
    const nextToken = nonWhitespaceTokens[i + 1];

    if (token.type === TokenType.KEYWORD_UNKNOWN) {
      errors.push({
        token,
        error: `Unknown keyword '${token.value}'`,
      });
    }

    if (token.type === TokenType.KEYWORD_PREDICTION) {
      // TODO: Empty keyword "{" not handled properly yet
      errors.push({
        token,
        error: `Possible keyword '${token.value}' has no closing curly brace "}"`,
      });
    }

    if (token.type === TokenType.ERROR) {
      errors.push({
        token,
        error: `Unknown token starting with '${token.value.substring(0, 5)}...'`,
      });
    }

    if (token.type === TokenType.OPERATOR) {
      if (!isValueToken(previousToken)) {
        errors.push({ token, error: `Unexpected operator '${token.value}'` });
      }
      if (i === nonWhitespaceTokens.length - 1) {
        errors.push({
          token,
          error: `Value expected after operator '${token.value}'`,
        });
      }
    }

    if (token.type === TokenType.NUMBER) {
      if (!isValueTokenAllowed(previousToken)) {
        errors.push({
          token,
          error: `An operator is required before the number ${token.value}`,
        });
      }
    }

    if (token.type === TokenType.FUNCTION) {
      // TODO: Validate if function exists and has correct number of arguments
      if (!isValueTokenAllowed(previousToken)) {
        errors.push({
          token,
          error: "An operator is required before the function",
        });
      }

      if (nextToken?.type !== TokenType.BRACKET || nextToken?.value !== "(") {
        errors.push({
          token,
          error: `Function '${token.value}' needs to be followed by a opening parenthesis "("`,
        });
      }
    }

    if (token.type === TokenType.COMMA) {
      if (!(functionLevel > 0)) {
        errors.push({ token, error: `Unexpected ','` });
      } else if (!isValueToken(previousToken)) {
        errors.push({ token, error: `Unexpected ','` });
      }
    }

    if (token.type === TokenType.BRACKET) {
      const previousTokenType = previousToken ? previousToken.type : null;

      if (token.value === "(") {
        unclosedTokens.push({
          text: "(",
          type: previousTokenType === "function-name" ? "function" : "group",
          token,
        });

        if (previousTokenType === "function-name") {
          functionLevel += 1;
        }

        if (
          previousTokenType !== "function-name" &&
          !isValueTokenAllowed(previousToken)
        ) {
          errors.push({
            token,
            error: "An operator is required before the parenthesis",
          });
        }
      }

      // TODO: Functions without arguments are currently not supported and will throw an error
      if (token.value === ")") {
        if (
          unclosedTokens.length > 0 &&
          unclosedTokens[unclosedTokens.length - 1].text === "("
        ) {
          if (unclosedTokens[unclosedTokens.length - 1].type === "function") {
            functionLevel--;
          }

          unclosedTokens.pop();

          if (
            !isValueToken(previousToken) &&
            !(
              previousToken?.value === "(" &&
              unclosedTokens[unclosedTokens.length - 1]?.type === "function"
            )
          ) {
            errors.push({ token, error: `Unexpected ')'` });
          }
        } else {
          errors.push({ token, error: `Unexpected ')'` });
        }
      }
    }

    previousToken = token;
  });

  for (const unclosedToken of unclosedTokens) {
    let reversedToken = unclosedToken.text;
    if (unclosedToken.text === "(") {
      reversedToken = ")";
    }

    errors.push({
      token: unclosedToken.token,
      error: `Missing closing '${reversedToken}'`,
    });
  }

  return errors;
}

function isValueTokenAllowed(previousToken: Token | null) {
  if (!previousToken) {
    return true;
  }

  return (
    previousToken.type === TokenType.OPERATOR ||
    previousToken.type === TokenType.COMMA ||
    (previousToken.type === TokenType.BRACKET && previousToken.value === "(")
  );
}

function isValueToken(token: Token | null) {
  if (!token) {
    return false;
  }

  if (
    token.type === TokenType.NUMBER ||
    token.type === TokenType.KEYWORD ||
    token.type === TokenType.KEYWORD_PREDICTION ||
    token.type === TokenType.KEYWORD_UNKNOWN
  ) {
    return true;
  }

  return token.type === TokenType.BRACKET && token.value === ")";
}
