import { Document, model, Schema } from 'mongoose';
import { GameBase, GameFull, GameListItem, GameSituation, PlayerBase, Role, UserBase } from 'poker-common';
import { StoryModel } from './story.model';
import { PlayerModel } from './player.model';
import { GameSituationModel } from './game-situation.model';
import { UserModel } from './user.model';


export interface GameDocument extends Document, Omit<GameFull, '_id'> {
  full(): Promise<GameFull>;

  base(): GameBase;

  listItem(): Promise<GameListItem> // интерефейс допилить
}

const GameSchema = new Schema<GameDocument>({
  roomName: {
    type: String,
    required: true
  },
  description: String

}, {timestamps: {createdAt: "createdDate", updatedAt: "updatedDate"}})

GameSchema.methods.base = function (): GameBase {
  return {
    createdDate: this.createdDate,
    description: this.description,
    roomName: this.roomName,
    _id: this._id,
  };
}
GameSchema.methods.full = async function (): Promise<GameFull> {
  const base = this.base();

  return {
    ...base,
    stories: (await StoryModel.find({gameID: this._id})).map((storyDocument) => storyDocument.base()),

    players: await Promise.all((await PlayerModel.find({gameID: this._id})).map((playerDocument) => playerDocument.full())),

    situation: (await GameSituationModel.findOne({gameID: this._id}))?.base() || null
  };

}
GameSchema.methods.listItem = async function (): Promise<GameListItem> {
  const listItem = {
    ...this.base(),
    creator: null
  } as GameListItem;

  const gameSituation: GameSituation | null = (await GameSituationModel.findOne({gameID: this._id}))?.base() || null;
  listItem.status = gameSituation?.status || null

  const gameCreatorPlayer: PlayerBase | null = (
    await PlayerModel.findOne({
      gameID: this._id,
      role: Role.Creator
    })
  )?.base() || null;

  if (gameCreatorPlayer) {
    const gameCreatorUser: UserBase | null = (
      await UserModel.findOne({
        _id: gameCreatorPlayer.userID
      })
    )?.base() || null;

    if (gameCreatorUser) {
      listItem.creator = gameCreatorUser;
    }
  }

  return listItem;


}

export const GameModel = model<GameDocument>('Game', GameSchema);

