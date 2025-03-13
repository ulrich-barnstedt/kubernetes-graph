import express from "express";
import * as path from "node:path";
import graphAPI from "./graphAPI";

const app = express();

app.use("/api", graphAPI);
app.use(express.static("static"));

const index = path.resolve("static/index.html");
app.get("/", (req, res) => {
   res.sendFile(index);
})

app.listen(8000, () => {
    console.log("Server listening on port :8000");
});
