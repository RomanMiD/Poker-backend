export class MiddlewareError {
  constructor(public message: string, public status: number, public data?: unknown) {

  }
}
