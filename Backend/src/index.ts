// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const indexRouter = require("./Routes/index");
const helloWorldRouter = require("./Routes/HelloWorldRoutes");
const authenticationRouter = require("./Routes/AuthenticationRoutes");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', indexRouter);
app.use("/HelloWorld", helloWorldRouter);
app.use("/authenticate", authenticationRouter);

if (process.env.NODE_ENV !== 'test'){
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
      });
}

export default app;