import express from "express";
import * as fs from "node:fs";

const app = express();
const port = 3000;

// TODO: The api should be secured via cors + api key
app.use(express.json());

// disable cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// example: GET http://localhost:3000/api/data
app.get("/api/data", function (req, res) {
  fs.readFile("./src/server/data.json", "utf8", (err, data) => {
    const jsonData = JSON.parse(data);
    res.send(jsonData);
  });
});

// example: PUT http://localhost:3000/api/data {"name":"test","displayName":"Test"}
app.put("/api/data", function (req, res) {
  // Obviously, this is not a secure way to handle data, but it's fine for this prototype
  // Validation: https://express-validator.github.io/docs/guides/getting-started
  // We would also need to handle duplicate entries
  const newData = req.body;
  fs.readFile("./src/server/data.json", "utf8", (err, data) => {
    const json = JSON.parse(data);
    json.push(newData);
    json.sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFile("./src/server/data.json", JSON.stringify(json), () => {
      res.send(json);
    });
  });
});

// example: DELETE http://localhost:3000/api/data/<name>
app.delete("/api/data/:name", function (req, res) {
  const name = req.params.name;

  fs.readFile("./src/server/data.json", "utf8", (err, data) => {
    const json = JSON.parse(data);
    const index = json.findIndex((x) => x.name === name);
    if (index === -1) {
      res
        .status(404)
        .send({ error: `Couldn't delete unknown entry "${name}".` });
    } else {
      json.splice(index, 1);
      fs.writeFile("./src/server/data.json", JSON.stringify(json), () => {
        res.send(json);
      });
    }
  });
});

//  404 middleware. Since it's placed last it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function (req, res) {
  res.status(404);
  res.send({ error: "Not found" });
});

app.listen(port);
console.log(`Express started on port ${port}`);
