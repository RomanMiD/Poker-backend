import { Router } from "express";
import { Validator } from "express-json-validator-middleware";
import { newGameBodySchema } from "./json-schemas/game/create.schema";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { GameController } from "../../controllers/api/game.controller";
import { fullGameParamsSchema } from "./json-schemas/game/full.schema";
import { gameAccessMiddleware } from "../../middlewares/access.middleware";
import { RequestOptionKey } from "../../common/enums/data-types";
import { strictBlackSchema } from "./json-schemas/common.schema";
import { listQuerySchema } from "./json-schemas/game/list.schema";

export const gameApiRoute = Router();

const validate = new Validator({allErrors: true}).validate;

gameApiRoute.post("/create", validate({body: newGameBodySchema}), authMiddleware, GameController.create);

gameApiRoute.get("/full/:id",
  validate({params: fullGameParamsSchema, query: strictBlackSchema, body: strictBlackSchema}),
  authMiddleware,
  gameAccessMiddleware({
    optionKey: RequestOptionKey.Params,
    path: "id"
  }),
  GameController.full);

gameApiRoute.get("/list",
  validate({params: strictBlackSchema, query: listQuerySchema, body: strictBlackSchema}),
  authMiddleware,
  GameController.list);

gameApiRoute.post(
  "/join-game/:gameID",
  authMiddleware,
  validate({body: strictBlackSchema}),
  GameController.joinGame);

