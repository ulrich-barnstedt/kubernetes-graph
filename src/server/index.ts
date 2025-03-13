import express from "express";
import {constructAggregatedGraph} from "./aggregator/aggregate.js";
import ViteExpress from "vite-express";
import {serialize} from '@ungap/structured-clone';

const app = express();

app.get("/graph", async (_req, res) => {
    const graph = await constructAggregatedGraph();

    res.send(serialize(graph));
})

ViteExpress.listen(app, 8000, () =>
    console.log("Server listening on port :8000"),
);
