import express from "express";
import {collectData} from "./aggregator/aggregate";

const router = express.Router();

router.get("/graph", async (req, res) => {
    res.send(await collectData());
})

export default router;
