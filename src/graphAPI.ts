import express from "express";
import {collectPods} from "./aggregate";

const router = express.Router();

router.get("/graph", async (req, res) => {
    res.send(await collectPods());
})

export default router;
