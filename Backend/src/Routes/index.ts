import express from 'express';
import { helloWorldRoute } from './HelloWorldRoutes';
import { authenticationRoutes } from './AuthenticationRoutes';

export const routes = express.Router();

// Automatically route to a 200 for now
routes.get("/", function (req, res) {
    res.redirect("/api/HelloWorld");
});

module.exports = routes;