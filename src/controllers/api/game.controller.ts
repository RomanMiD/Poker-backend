import { Request, Response } from "express";
import { MiddlewareError } from "../../classes/middleware-error";
import { Game } from "poker-common";
import { GameModel } from "../../models/game.model";
import { MiddlewareUtilities } from "../../utilities/middleware.utilities";
import { UserDocument } from "../../models/user.model";
import { Schema } from "mongoose";
import { ObjectId } from "mongodb";
import { storyModel } from "../../models/story.model";


export class GameController {

  static async createGame(req: Request, res: Response, next: (err: MiddlewareError) => void) {
    const userDocument: UserDocument = res.locals.user;
    const createGameData: Game = {
      ...req.body,
      creatorID: new ObjectId(userDocument.base()._id)
    }

    const newGame = new GameModel(createGameData);
    const gameDocument = await newGame.save();
    const stories = createGameData.stories.map((story)=>({...story, gameId: gameDocument._id}));
    await storyModel.insertMany(stories);
    if (gameDocument) {
       MiddlewareUtilities.responseData(res, await gameDocument.base());
    } else {
      next(new MiddlewareError("invalid game data", 401));
    }

  }

}
