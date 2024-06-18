// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { routes } from "./Routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use('/', routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});