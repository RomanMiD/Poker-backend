import { Response } from "express";
import { ResponseWrapper } from "poker-common";

export namespace MiddlewareUtilities {
  export const responseData = (res: Response, data: unknown) => {
    const responseBody: ResponseWrapper<unknown> = {
      error: null,
      data
    };
   return res.send(responseBody);
  }
}
