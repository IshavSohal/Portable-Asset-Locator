import express from 'express';
import { helloWorldRoute } from './HelloWorldRoutes';
import { authenticationRoutes } from './AuthenticationRoutes';

export const routes = express.Router();

routes.get("/", function (req, res) {
    res.redirect("/HelloWorld");
});

module.exports = routes;