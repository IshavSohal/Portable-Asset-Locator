// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { routes } from "./Routes";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const distPath = path.join(__dirname, '../../Frontend/build')

app.use(express.static(distPath))

// API routes
app.use('/api/', routes);

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