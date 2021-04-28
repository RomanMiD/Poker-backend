import { Document, model, Schema } from "mongoose";
import { Game } from "poker-common";
import { storyModel } from "./story.model";


export interface GameDocument extends Document, Omit<Game, "_id"> {
  base(): Game;
}

const GameSchema = new Schema<GameDocument>({
  roomName: {
    type: String,
    required: true
  },
  creatorID: {
    type: String,
    required: true
  },
  description: String

}, {timestamps: {createdAt: "createdDate", updatedAt: "updatedDate"}})
GameSchema.methods.base = async function (): Promise<Game> {

  return {
    createdDate: this.createdDate,
    creatorID: this.creatorID,
    description: this.description,
    roomName: this.roomName,
    _id: this._id,
    stories: (await storyModel.find({gameId: this._id})).map((storyDocument) => storyDocument.base()),
    playersID: []
  };

}
export const GameModel = model<GameDocument>("Game", GameSchema);

