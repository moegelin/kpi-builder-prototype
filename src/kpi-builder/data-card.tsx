import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label.tsx";
import { useState } from "react";
import { Data } from "@/kpi-builder/data.types.ts";

type CardWithFormProps = {
  data: Data[];
  onSubmit?: (data: Data[]) => void;
};

export function CardWithForm({ data, onSubmit }: CardWithFormProps) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();

        if (displayName && name) {
          if (data.find((entry) => entry.name === name)) {
            setErrors(["Technical name already exists"]);
            return;
          } else {
            fetch("http://localhost:3000/api/data", {
              headers: {
                "Content-Type": "application/json",
              },
              method: "PUT",
              body: JSON.stringify({ name, displayName }),
            })
              .then((response) => response.json())
              .then((responseData) => {
                setName("");
                setDisplayName("");
                setErrors([]);
                onSubmit?.(responseData);
              });
          }
        } else {
          const errors = [];
          if (!displayName) {
            errors.push("Display name is required");
          }
          if (!name) {
            errors.push("Technical name is required");
          }
          setErrors(errors);
        }
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Add new data</CardTitle>
          <CardDescription>New data can be simply added here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 items-start">
              <Label htmlFor="name">Technical Name</Label>
              <Input
                id="name"
                value={name}
                placeholder="Enter a technical name..."
                onChange={(ev) => {
                  setName(ev.target.value);
                }}
              />
            </div>
            <div className="flex flex-col space-y-1.5 items-start">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={displayName}
                placeholder="Enter a display name..."
                onChange={(ev) => {
                  setDisplayName(ev.target.value);
                }}
              />
            </div>
          </div>
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type={"submit"} variant={"outline"}>
            Add
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
