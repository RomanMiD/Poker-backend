import { Document, model, Schema } from 'mongoose';
import { GameBase, GameFull } from 'poker-common';
import { StoryModel } from './story.model';
import { PlayerModel } from './player.model';
import { GameSituationModel } from './game-situation.model';


export interface GameDocument extends Document, Omit<GameFull, '_id'> {
  full(): GameFull;
  base(): GameBase;
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
  const base =  this.base();
  return {
    ...base,
    stories: (await StoryModel.find({gameID: this._id})).map((storyDocument) => storyDocument.base()),
    players: (await PlayerModel.find({gameID: this._id})).map((playerDocument) => playerDocument.base()),
    situation: (await GameSituationModel.findOne({gameID: this._id}))?.toObject() || null
  };

}

export const GameModel = model<GameDocument>("Game", GameSchema);

