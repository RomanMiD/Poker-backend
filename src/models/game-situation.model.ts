import { Document, model, Schema } from 'mongoose';
import { GameSituation, StoryResult, Vote } from 'poker-common';

interface GameSituationDocument extends Document, Omit<GameSituation, '_id'> {
  base(): GameSituation
}

interface StoryResultDocument extends Document, StoryResult {
  base(): StoryResult
}

interface VoteDocument extends Document, Vote {
  base(): Vote
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
  nominal: {
    type: String,
    default: 'none',
    required: true
  }


});

VoteSchema.methods.base = function (): Vote {
  return {
    voteDate: this.voteDate,
    nominal: this.nominal,
    playerID: this.playerID
  }
}

const StoriesResultSchema = new Schema<StoryResultDocument>({
  voteStartDate: {
    type: Date
  },
  voteEndDate: {
    type: Date
  },
  votes: {
    type: [VoteSchema],
    required: true,
    child: VoteSchema
  }
});
StoriesResultSchema.methods.base = function (): StoryResult {
  return {
    voteStartDate: this.voteStartDate,
    voteEndDate: this.voteEndDate,
    votes: this.votes.map((vote) =>{
      const voteDocument = vote as VoteDocument;
      return voteDocument.base();
    })
  }
}

const GameSituationSchema = new Schema<GameSituationDocument>({
  gameID: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  storiesResult: {
    type: [StoriesResultSchema],
    child: StoriesResultSchema
  }
});

GameSituationSchema.methods.base = function (): GameSituation {
  return {
    gameID: this.gameID,
    status: this.status,
    storiesResult: this.storiesResult?.map((storyResult) => {
      const storyResultDocument = storyResult as StoryResultDocument ;
      return storyResultDocument.base();
    })

  }
}

export const GameSituationModel = model<GameSituationDocument>("GameSituation",GameSituationSchema);
