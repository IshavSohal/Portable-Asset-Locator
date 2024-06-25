import express from 'express';
import { helloWorldRoute } from './HelloWorldRoutes';

export const routes = express.Router();

routes.use(helloWorldRoute);