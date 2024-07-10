// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const indexRouter = require("./Routes/index");
const helloWorldRouter = require("./Routes/HelloWorldRoutes");
const authenticationRouter = require("./Routes/AuthenticationRoutes");
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const distPath = path.join(__dirname, '../../Frontend/build')

app.use(express.static(distPath))
app.use(express.json());

// API routes
app.use('/api/', indexRouter);
// Hello World endpoints have the /HelloWorld path
app.use("/HelloWorld", helloWorldRouter);
// Authetication functionalities are preceded by the /authenticate path
app.use("/authenticate", authenticationRouter);

// Handles any requests that don't match the ones above
app.get('*', (req, res) =>{
  res.sendFile(path.join(distPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'test'){
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
      });
}

export default app;