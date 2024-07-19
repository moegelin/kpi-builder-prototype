import React, { useState } from "react";
import "./guide.css";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { clsx } from "clsx";

/**
 * Component FormulaBuilderGuide
 */
const FormulaBuilderGuide = (): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
      <div className={"guide"}>
        <h3 className={"text-xl font-medium leading-none tracking-tight"}>
          Formula Builder Guide
        </h3>
        <p className={""}>
          Welcome to the Formula Builder! This guide will help you understand
          how to create your own Key Performance Indicators (KPIs) using a
          simple syntax.
        </p>
        <h4 className={"font-semibold"}>Basic Syntax</h4>
        <p>Your formulas can include:</p>

        <CollapsibleContent>
          <div className={"guide"}>
            <ol className={"list-decimal pl-4"}>
              <li className={"m-2 pl-1"}>
                <strong>Numbers</strong>: Any integer. For example:{" "}
                <code>23</code>, <code>14</code>
              </li>
              <li className={"m-2 pl-1"}>
                <strong>Keywords</strong>: Dynamic values that you have defined.
                Keywords must be enclosed in curly braces <code>{}</code>. For
                example: <code>{"{keyword}"}</code> or{" "}
                <code>{"{temperature}"}</code>
              </li>
              <li className={"m-2 pl-1"}>
                <strong>Arithmetic Operators</strong>: Standard arithmetic
                operators:
                <ul>
                  <li>
                    Addition: <code>+</code>
                  </li>
                  <li>
                    Subtraction: <code>-</code>
                  </li>
                  <li>
                    Multiplication: <code>*</code>
                  </li>
                  <li>
                    Division: <code>/</code>
                  </li>
                </ul>
              </li>
              <li className={"m-2 pl-1"}>
                <strong>Functions</strong>: Supported functions include{" "}
                <code>round</code>, <code>sin</code>, and <code>tan</code>.
                Functions follow the format:{" "}
                <code>functionName(expression)</code>
              </li>
            </ol>
            <h4 className={"font-semibold"}>Important Notes</h4>
            <ul className={"list-disc pl-4"}>
              <li>
                Ensure all keywords used in the formula are defined beforehand.
              </li>
              <li>
                Use parentheses <code>()</code> to group operations and control
                the order of execution.
              </li>
              <li>
                Functions should always be followed by parentheses{" "}
                <code>()</code> containing the expression they operate on.
              </li>
            </ul>
          </div>
        </CollapsibleContent>

        <CollapsibleTrigger asChild>
          <Button
            variant="link"
            size="sm"
            className={clsx("toggle", { "is-closed": !isOpen })}
          >
            {isOpen ? (
              <ChevronsUp className="h-4 w-4" />
            ) : (
              <ChevronsDown className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  );
};
FormulaBuilderGuide.displayName = "FormulaBuilderGuide";

export { FormulaBuilderGuide };
