import { Document, model, Schema } from 'mongoose';
import { PlayerBase, PlayerFull, PlayerStatus, Role } from 'poker-common';
import { UserModel } from "./user.model";

export interface PlayerDocument extends Document, Omit<PlayerBase, '_id'> {
  base(): PlayerBase;
  full(): PlayerFull;
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
PlayerSchema.methods.base = function (): PlayerBase {
  return {
    _id: this._id,
    gameID: this.gameID,
    userID: this.userID,
    role: this.role,
    status: this.status,
    lastOnlineDate: this.lastOnlineDate
  }
};

PlayerSchema.methods.full = async function (): Promise<PlayerFull>{
  return {
    ...this.base(),
    user: (await UserModel.findOne({_id: this.userID}))?.base()
  }
}
export const PlayerModel = model<PlayerDocument>('Player', PlayerSchema);

