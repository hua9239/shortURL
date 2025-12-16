const express = require("express");
const apiRouter = require("./routes/api");
const redirectRouter = require("./routes/redirect");
const app = express();
const port = 3000;

app.use(express.json());
app.use("/api", apiRouter);
app.use("/", redirectRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});