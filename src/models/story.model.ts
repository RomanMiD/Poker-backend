import { model, Schema, Document } from "mongoose";
import { Story } from "poker-common";

export interface StoryDocument extends Document, Omit<Story, "_id"> {
  base(): Story
}

const storySchema = new Schema<StoryDocument>({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  gameId: {
    type: String,
    required: true
  }

})
storySchema.methods.base = function (): Story {
  return {_id: this._id, body: this.body, position: this.position, title: this.title, gameId: this.gameId};
};

export const storyModel = model<StoryDocument>("Story", storySchema);
