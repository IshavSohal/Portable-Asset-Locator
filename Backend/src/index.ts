// src/index.js
import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
// import { routes } from "./Routes";
import path from "path";
import session from 'express-session';
import cors from 'cors';
const indexRouter = require("./Routes/index");
const helloWorldRouter = require("./Routes/HelloWorldRoutes");
const authenticationRouter = require("./Routes/AuthenticationRoutes");
const assetRouter = require("./Routes/AssetRoutes");
const assignmentRouter = require("./Routes/AssignmentRoutes");
const requestRouter = require("./Routes/RequestRoutes")


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;
const client = process.env.CLIENT_PORT || 3000; 
const distPath = path.join(__dirname, '../../Frontend/build');

app.use(session({
  secret: 'EC-PAL-Session',
  resave: false,
  saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure:(process.env.LOCAL_ENV) ? false : true,
      maxAge: 3600000 
    }
}));

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

declare module 'express-session' {
  export interface SessionData {
    user: User
  }
}

const corsOptions = {
  credentials: true,
  origin: 'http://localhost:' + client,

};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static(distPath))

app.use('/api', indexRouter);
// Authetication functionalities are preceded by the /authenticate path
app.use("/api/auth", authenticationRouter);
// Hello World endpoints have the /HelloWorld path
app.use("/api/HelloWorld", helloWorldRouter);
// Asset functionalities are preceded by the /asset path
app.use("/api/asset", assetRouter);
// Assignment functionalities are preceded by the /assignment path
app.use("/api/assignment", assignmentRouter);
// Request functionalies are preceded by the /request path
app.use("/api/request", requestRouter);
// API routes
// app.use('/api/', routes);

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'test'){
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
      });
}

export default app;