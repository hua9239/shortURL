const express = require("express");
const apiRouter = require("./routes/api");
const redirectRouter = require("./routes/redirect");
const { errorResponse } = require('./utils/responseHandler');
const app = express();
const port = 3000;

app.use(express.json());
app.use("/api", apiRouter);
app.use("/", redirectRouter);

app.use("/api", (req, res) => {
    errorResponse(res, 'API endpoint not found', 404);
});

app.use((req, res) => {
    console.log(`Unmatched route: ${req.originalUrl}, redirecting to home.`);
    // res.status(404).send('Page not found');
    res.redirect('/');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    if (req.path.startsWith('/api')) {
        return errorResponse(res, 'Internal Server Error', 500);
    }
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});