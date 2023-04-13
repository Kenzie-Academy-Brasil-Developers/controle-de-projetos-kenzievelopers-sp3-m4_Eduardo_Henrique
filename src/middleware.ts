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

export const ensureUserExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);
  const queryString = `
        SELECT 
            * 
        FROM 
            developers
        WHERE 
            id = $1;
        `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IDeveloper> = await client.query(queryConfig);
  console.log(queryResult.rows.length)
  if (queryResult.rows.length == 0) {
  
    return response.status(404).json({
      message: "Developer not found.",
    });
  }
  return next();

};