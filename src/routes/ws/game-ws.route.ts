import express, { Router } from "express";
import "express-ws";
import { GameSocketsService } from "../../services/game-sockets.service";
import expressWs from "express-ws";

expressWs(express());
export const gameWsRoute = Router();


gameWsRoute.ws("/:id", (ws, req) => {
  // @ts-ignore
  GameSocketsService.addSocket(req.params.id, ws)
  ws.send(JSON.stringify({message: 'odin'}));
  ws.on("message", function (msg) {
    console.log(msg);
    ws.send(JSON.stringify({data: "data3"}));
  });
  ws.on('close', function () {
    // @ts-ignore
    GameSocketsService.deleteSocket(req.params.id, ws);
  })
})
