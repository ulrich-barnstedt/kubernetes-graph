import express from "express";
import {constructAggregatedGraph} from "./aggregator/aggregate.js";
import ViteExpress from "vite-express";

const app = express();

app.get("/graph", async (_req, res) => {
    const graph = await constructAggregatedGraph();
    res.send(graph);
})

ViteExpress.listen(app, 8000, () =>
    console.log("Server listening on port :8000"),
);
