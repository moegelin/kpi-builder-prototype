import { useEffect, useState } from "react";
import { DataTable } from "@/kpi-builder/data-table.tsx";
import { CardWithForm } from "@/kpi-builder/data-card.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Data } from "@/kpi-builder/data.types.ts";

export default function DataForm() {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/data", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <>
      <div className={"container"}>
        <CardWithForm
          data={data}
          onSubmit={(newData) => {
            setData(newData);
          }}
        />
      </div>
      <div className="container mx-auto py-4">
        <Card className="">
          <CardContent>
            <DataTable data={data} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
