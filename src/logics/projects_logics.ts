import { Request, Response } from "express";
import format from "pg-format";
import { client } from "../database";
import { QueryConfig, QueryResult } from "pg";
import { IProjects, IProjectsDescription, IProjectsRequest } from "../interfaces/interfaceProject";

export const createProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const data: IProjectsRequest = request.body;

  const queryString = format(
    `
      INSERT INTO
             projects
             (%I)
      VALUES
             (%L)
      RETURNING *
    `,
    Object.keys(data),
    Object.values(data)
  );

  const queryResult: QueryResult<IProjects> = await client.query(queryString);
  if (queryResult.rows[0].endDate == undefined) {
    delete queryResult.rows[0].endDate;
  }
  return response.status(201).json(queryResult.rows[0]);
};
export const updateProject = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const data: IProjectsRequest = request.body;
  const id: number = Number(request.params.id);
  const queryString = format(
    `
    UPDATE
          projects
    SET (%I) = (%L)
    WHERE
        id = $1
    RETURNING *;
  `,
    Object.keys(data),
    Object.values(data)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};


