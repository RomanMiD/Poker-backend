import "express-ws";

export class GameSocketsService {
  private static sockets: { [gameID: string]: WebSocket[] } = {};

  static sendEveryone(gameID: string, data: unknown): void {
    if (this.sockets[gameID]?.length) {

      this.sockets[gameID].forEach((socket) => {

        socket.send(JSON.stringify(data));
      })
    }
  }

  static addSocket(gameID: string, socket: WebSocket): void {
    if (!this.sockets[gameID]) {
      this.sockets[gameID] = [];
    }
    this.sockets[gameID].push(socket);
  }

  static deleteSocket(gameID: string, socket: WebSocket): void {
    if (this.sockets[gameID]?.length) {
      this.sockets[gameID] = this.sockets[gameID].filter((value) => value !== socket);
    }
  }
}
