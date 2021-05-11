import {Document, model, Schema } from 'mongoose';
import { GameSituation, StoriesResult, Vote } from 'poker-common';

interface GameSituationDocument extends Document, Omit<GameSituation, '_id'> {

}
interface StoriesResultDocument extends Document, StoriesResult{

}
interface VoteDocument extends Document, Vote{

}
const VoteSchema= new Schema<VoteDocument>({
  playerID:{
    type: String,
    default: '',
    required: true
  },
  voteDate:{
    type: Date,
    default: Date.now(),
    required: true
  },
  nominal:{
    type: String,
    default: 'none',
    required: true
  }


});

const StoriesResultSchema = new Schema<StoriesResultDocument>({
  votes:{
    type: [VoteSchema],
    required: true,
    child: VoteSchema
  }
});

const GameSituationSchema = new Schema<GameSituationDocument>({
  gameID: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  storiesResult:{
    type: Schema.Types.ObjectId,
    ref: 'StoriesResultSchema'
  }
});



export const GameSituationModel = model<GameSituationDocument>("GameSituation",GameSituationSchema);
