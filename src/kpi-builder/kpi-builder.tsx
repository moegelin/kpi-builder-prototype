import { useEffect, useRef, useState } from "react";
import "./kpi-builder.css";

import type { Token } from "moo";
import { Data } from "@/kpi-builder/data.types.ts";
import { validateTokens } from "@/kpi-builder/kpi-validator.ts";
import { getLexer, TokenType } from "@/kpi-builder/lexer.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { FormulaBuilderGuide } from "@/kpi-builder/guide.tsx";
import { cn } from "@/lib/utils.ts";

type TokenError = {
  token: Token;
  error: string;
};

export default function KpiBuilder() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataVariables, setDataVariables] = useState<Data[]>([]);
  const [formula, setFormula] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [errors, setErrors] = useState<TokenError[]>([]);
  const lexer = useRef<moo.Lexer | null>(null);
  const lastToken = tokens[tokens.length - 1];

  useEffect(() => {
    fetch("http://localhost:3000/api/data", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setDataVariables(data);
      });
  }, []);

  useEffect(() => {
    lexer.current = getLexer(dataVariables);
  }, [dataVariables]);

  return (
    <>
      <div className={"container"}>
        <Card>
          <CardHeader>
            <CardTitle>KPI Builder</CardTitle>
            <CardDescription>
              Build your own KPI with a simple formula.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-4">
              <FormulaBuilderGuide />
              <div className="grid w-full">
                {!isEditMode ? (
                  <div
                    className={"w-full min-h-10 border-2 p-2"}
                    tabIndex={1}
                    onFocus={() => {
                      setIsEditMode(true);
                    }}
                  >
                    {tokens.map((token, index) => (
                      <span key={index} className={`token ${token.type}`}>
                        {token.value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className={"grow-wrap"}>
                    <textarea
                      rows={1}
                      className={"w-full py-2"}
                      value={formula}
                      onFocus={(event) => {
                        event.target.selectionStart = -1;
                      }}
                      onInput={(ev) => {
                        // eslint-disable-next-line
                        // @ts-ignore
                        ev.currentTarget.parentNode!.dataset.replicatedValue =
                          ev.currentTarget.value;
                      }}
                      autoFocus={true}
                      onChange={(ev) => {
                        const formulaText = ev.target.value;
                        setFormula(formulaText);

                        if (lexer.current) {
                          lexer.current.reset(formulaText);
                          const t = [...lexer.current];
                          const err = validateTokens(t);

                          setTokens(t);
                          setErrors(err);
                        }
                      }}
                      onBlur={() => {
                        setIsEditMode(false);
                      }}
                    />
                  </div>
                )}
                {isEditMode &&
                  lastToken?.type === TokenType.KEYWORD_PREDICTION && (
                    <div>
                      {dataVariables
                        .filter((keyword) =>
                          keyword.name.toLowerCase().includes(lastToken.value),
                        )
                        .map((keyword) => (
                          <p key={keyword.name} className={"suggestion"}>
                            <span className={"technical-name"}>
                              {keyword.name}
                            </span>
                            <span className={"display-name"}>
                              {keyword.displayName}
                            </span>
                          </p>
                        ))}
                    </div>
                  )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div
              className={cn("px-2", {
                "text-red-500": !isEditMode,
                "text-gray-400": isEditMode,
              })}
            >
              {errors.map((error, index) => (
                <p key={index} className={"c-error"}>
                  {error.error}
                </p>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
