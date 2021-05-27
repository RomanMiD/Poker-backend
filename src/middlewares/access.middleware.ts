import { Request, Response } from "express";
import { MiddlewareError } from "../classes/middleware-error";
import { RequestOptionKey } from "../common/enums/data-types";
import { get } from "lodash";
import { PlayerDocument, PlayerModel } from "../models/player.model";
import { Role } from "poker-common";

export const gameAccessMiddleware = ({optionKey, path}: { optionKey: RequestOptionKey, path: string }) => {
  return async (req: Request, res: Response, next: (err?: MiddlewareError) => void) => {
    const gameID: string = get(req, `${optionKey}.${path}`);
    if (gameID) {
      const query = {
        gameID,
        userID: `${res.locals.user._id}`,
        role: {$ne: Role.Banned}
      }
      const playerDocument: PlayerDocument | null =
        await PlayerModel.findOne(query);
      if (playerDocument) {
        next();
        return;
      }
    }
    next(new MiddlewareError("access denied", 403));
  }
}
