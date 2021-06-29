import { Request, Response } from "express";
import { MiddlewareError } from "../../classes/middleware-error";
import { GameModel } from "../../models/game.model";
import { MiddlewareUtilities } from "../../utilities/middleware.utilities";
import { UserDocument, UserModel } from "../../models/user.model";
import { StoryModel } from "../../models/story.model";
import sanitize from "mongo-sanitize";
import { PlayerModel } from "../../models/player.model";
import { GameSituationModel } from "../../models/game-situation.model";
import { GameSocketsService } from "../../services/game-sockets.service";
import {
  CreateGameRequest,
  GameListItem,
  GameSituation,
  GameStatus,
  PaginationWrapper,
  PlayerBase,
  PlayerStatus,
  Role
} from "poker-common";

export class GameController {

  static async create(req: Request, res: Response, next: (err: MiddlewareError) => void) {
    const userDocument: UserDocument = res.locals.user;
    const createGameData: CreateGameRequest = {
      ...sanitize(req.body)
    }
    const newGame = new GameModel(createGameData);
    const gameDocument = await newGame.save();
    const stories = createGameData.stories.map((story) => ({...story, gameID: gameDocument._id}));
    await StoryModel.insertMany(stories);
    const foundUsers = await UserModel.find().where("email").in(createGameData.playersEmail);
    const players: PlayerBase[] = foundUsers.map((userDocument) => ({
      userID: userDocument._id as string,
      role: Role.Observer,
      status: PlayerStatus.NotInTheGame,
      gameID: gameDocument._id as string,
      lastOnlineDate: null
    }));
    const creator: PlayerBase = {
      userID: userDocument._id,
      role: Role.Creator,
      status: PlayerStatus.NotInTheGame,
      gameID: gameDocument._id,
      lastOnlineDate: null
    };

    await PlayerModel.create(creator);
    await PlayerModel.insertMany(players);

    const situation: GameSituation = {
      gameID: gameDocument._id,
      status: GameStatus.Idle,
      // TODO Додумать это место.
      // storiesResult: [],
      storiesResult: null,
      currentStoryID: null
    };
    await GameSituationModel.create(situation);

    if (gameDocument) {
      MiddlewareUtilities.responseData(res, await gameDocument.full());
    } else {
      next(new MiddlewareError("invalid game data", 400));
    }

  }

  static async full(req: Request, res: Response, next: (err: MiddlewareError) => void) {
    const foundGameData = {_id: sanitize(req.params.id)};

    const gameDocument = await GameModel.findOne(foundGameData);
    if (gameDocument) {
      MiddlewareUtilities.responseData(res, await gameDocument.full());
    } else {
      next(new MiddlewareError("invalid id", 400));
    }

  };

  static async list(req: Request, res: Response, _next: (err: MiddlewareError) => void) {
    const paginationParams = {
      limit: +((req?.query?.limit) || "10"),
      skip: +((req?.query?.skip) || "0"),
    }

    const playersDocuments = await PlayerModel.find({userID: res.locals.user._id}, {},);
    if (!playersDocuments.length) {
      // Если нет игроков, то нет и игр
      MiddlewareUtilities.responseData(res, []);
      return;
    }

    const gamesIDs = playersDocuments.map((player) => player.gameID);
    //общее количество элементов без пагинации
    const count = await GameModel.find().where("_id").in(gamesIDs).countDocuments();
    //список элементов-промисов после пагинации
    const gamesPromises: Promise<GameListItem>[] = (await GameModel.find().where("_id").in(gamesIDs)
        .skip(paginationParams.skip)
        .limit(paginationParams.limit)
    ).map(async (gameDocument) => await gameDocument.listItem());

    const games: GameListItem[] = await Promise.all(gamesPromises);
    const responseData: PaginationWrapper<GameListItem> = {
      count,
      items: games
    };

    MiddlewareUtilities.responseData(res, responseData);
  }

  static async joinGame(req: Request, res: Response, _next: (err: MiddlewareError) => void) {
    const gameID = req.params.gameID;
    const userDocument: UserDocument = res.locals.user;
    const foundPlayerDocument = await PlayerModel.findOne({gameID, userID: userDocument._id});
    if (!foundPlayerDocument) {
      const newPlayer: PlayerBase = {
        gameID,
        userID: userDocument._id,
        role: Role.Member,
        status: PlayerStatus.NotInTheGame,
        lastOnlineDate: null,
      };

      const newPlayerDocument = await new PlayerModel(newPlayer).save();
      GameSocketsService.sendEveryone(gameID, {event: `player online`, data: newPlayerDocument.base()})
    } else {
      if (foundPlayerDocument.role !== Role.Banned) {
        foundPlayerDocument.status = PlayerStatus.Online;
        await foundPlayerDocument.save();
        GameSocketsService.sendEveryone(gameID, {event: `player online`, data: foundPlayerDocument.base()})
      }
    }

    MiddlewareUtilities.responseData(res, {});

  }
}
