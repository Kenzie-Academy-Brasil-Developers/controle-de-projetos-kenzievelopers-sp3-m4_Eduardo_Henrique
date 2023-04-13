import { NextFunction, Request, Response, request } from "express";
import { IDeveloper } from "./interfaces/interfaceDevelop";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";

export const ensureEmailExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const email: string = request.body.email;
  const queryString = `
      SELECT 
          * 
      FROM 
          developers
      WHERE 
          email = $1;
      `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };
  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);
  if (queryResult.rows.length > 0) {
    return response.status(409).json({ error: "Email already exists" });
  }

  return next();
};
