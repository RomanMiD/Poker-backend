import { Document, model, Schema } from 'mongoose';
import { GameFull } from 'poker-common';
import { StoryModel } from './story.model';
import { PlayerModel } from './player.model';


export interface GameDocument extends Document, Omit<GameFull, '_id'> {
  full(): GameFull;
}

const GameSchema = new Schema<GameDocument>({
  roomName: {
    type: String,
    required: true
  },
  // не используется(Но используется) ВЫПИЛИТЬ
  creatorID: {
    type: String,
    required: true
  },
  description: String

}, {timestamps: {createdAt: "createdDate", updatedAt: "updatedDate"}})
GameSchema.methods.full = async function (): Promise<GameFull> {
  return {
    createdDate: this.createdDate,
    creatorID: this.creatorID,
    description: this.description,
    roomName: this.roomName,
    _id: this._id,
    stories: (await StoryModel.find({gameID: this._id})).map((storyDocument) => storyDocument.base()),
    players: (await PlayerModel.find({gameID: this._id})).map((playerDocument) => playerDocument.base())
  };

}
export const GameModel = model<GameDocument>("Game", GameSchema);

