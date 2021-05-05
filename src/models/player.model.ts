import { Document, model, Schema } from 'mongoose';
import { Player, PlayerStatus, Role } from 'poker-common';

export interface PlayerDocument extends Document, Omit<Player, '_id'> {
  base(): Player;
}

const PlayerSchema = new Schema<PlayerDocument>({
  role: {
    default: Role.Observer,
    type: String,
    required: true,
  },
  gameID: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  status: {
    default: PlayerStatus.NotInTheGame,
    type: String,
    required: true
  },
  lastOnlineDate: {
    default: null,
    type: Date
  }

});
PlayerSchema.methods.base = function (): Player {
  return {
    _id: this._id,
    gameID: this.gameID,
    userID: this.userID,
    role: this.role,
    status: this.status,
    lastOnlineDate: this.lastOnlineDate
  }
}
export const PlayerModel = model<PlayerDocument>('Player', PlayerSchema);

