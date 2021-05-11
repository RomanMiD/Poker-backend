import { Request, Response } from 'express';
import { MiddlewareError } from '../../classes/middleware-error';
import { GameModel } from '../../models/game.model';
import { MiddlewareUtilities } from '../../utilities/middleware.utilities';
import { UserDocument, UserModel } from '../../models/user.model';
import { StoryModel } from '../../models/story.model';
import sanitize from 'mongo-sanitize';
import { CreateGameRequest, Player, PlayerStatus, Role } from 'poker-common';
import { PlayerModel } from '../../models/player.model';


export class GameController {

  static async create(req: Request, res: Response, next: (err: MiddlewareError) => void) {
    const userDocument: UserDocument = res.locals.user;
    const createGameData: CreateGameRequest = {
      ...sanitize(req.body),
      creatorID: userDocument.base()._id
    }
    const newGame = new GameModel(createGameData);
    const gameDocument = await newGame.save();
    const stories = createGameData.stories.map((story) => ({...story, gameID: gameDocument._id}));
    await StoryModel.insertMany(stories);
    const foundUsers = await UserModel.find().where('email').in(createGameData.playersEmail);
    const players: Player[] = foundUsers.map((userDocument) => ({
      userID: userDocument._id as string,
      role: Role.Observer,
      status: PlayerStatus.NotInTheGame,
      gameID: gameDocument._id as string,
      lastOnlineDate: null
    }));
    await PlayerModel.insertMany(players);
    const creator: Player = {
      userID: res.locals.user._id,
      role: Role.Creator,
      status: PlayerStatus.NotInTheGame,
      gameID: gameDocument._id,
      lastOnlineDate: null
    };
    await PlayerModel.create(creator);
    if (gameDocument) {
      MiddlewareUtilities.responseData(res, await gameDocument.full());
    } else {
      next(new MiddlewareError('invalid game data', 400));
    }

  }

  static async full(req: Request, res: Response, next: (err: MiddlewareError) => void) {
    const foundGameData = {_id: sanitize(req.params.id)};

    const gameDocument = await GameModel.findOne(foundGameData);
    if (gameDocument) {
      MiddlewareUtilities.responseData(res, await gameDocument.full());
    } else {
      next(new MiddlewareError('invalid id', 400));
    }

  }

}
