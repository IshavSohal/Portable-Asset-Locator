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
// Hello World endpoints have the /HelloWorld path
app.use("/HelloWorld", helloWorldRouter);
// Authetication functionalities are preceded by the /authenticate path
app.use("/authenticate", authenticationRouter);

if (process.env.NODE_ENV !== 'test'){
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
      });
}

export default app;