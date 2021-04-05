import { Response } from "express";
import { ResponseWrapper } from "poker-common";
import { domainToASCII } from "url";

export namespace MiddlewareUtilities {
  export const responseData = (res: Response, data: unknown) => {
    const responseBody: ResponseWrapper<unknown> = {
      error: null,
      data
    };
    res.send(responseBody);
  }
}
