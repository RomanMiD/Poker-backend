import "express-ws";
import express, { Router } from "express";
import expressWs from "express-ws";
import { gameWsRoute } from "./game-ws.route";

expressWs(express());
export const wsRoute = Router();

wsRoute.use('/game', gameWsRoute)
