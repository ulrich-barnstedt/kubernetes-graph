import express from "express";
import * as path from "node:path";
import {constructAggregatedGraph} from "./aggregator/aggregate";

const app = express();

app.get("/graph", async (req, res) => {
    const graph = await constructAggregatedGraph();
    res.send(graph.flatSerialize());
})

app.use(express.static("static"));
const index = path.resolve("static/index.html");
app.get("/", (req, res) => {
   res.sendFile(index);
})

app.listen(8000, () => {
    console.log("Server listening on port :8000");
});
